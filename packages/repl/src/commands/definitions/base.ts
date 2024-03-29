// rue packages
import definitions from '@ruejs/definition';
import { ActiveSupport$Base as Support } from '@ruejs/activesupport';

// third party
import chalk from 'chalk';

// types
import * as replt from 'repl';

export class Repl$Commands$Definitions$Base {
  static displayDefinition(input: string, repl: replt.REPLServer) {
    if (input) {
      try {
        let [maybeKlassName, maybeProto, methodName] = input.split('.');
        const isBuiltinClass =
          typeof repl.context[maybeKlassName] === 'function' &&
          maybeProto == undefined &&
          methodName == undefined &&
          definitions[maybeKlassName];

        const isUDFClass =
          typeof this.evalInContext(maybeKlassName, repl.context) === 'function' &&
          maybeProto == undefined &&
          methodName == undefined;

        const isStatic =
          typeof repl.context[maybeKlassName] === 'function' &&
          maybeProto &&
          methodName == undefined;

        const isInstance =
          typeof repl.context[maybeKlassName] === 'function' && maybeProto && methodName !== '';

        const isUDFInstance =
          typeof this.evalInContext(maybeKlassName, repl.context) === 'object' &&
          maybeProto &&
          methodName == undefined;

        let methodData;

        if (isBuiltinClass) {
          const metadata = definitions[maybeKlassName]['metadata'];
          const classData = definitions[maybeKlassName]['class'];
          const klass = repl.context[maybeKlassName];
          const isRueModule = klass['__rue_module__'];

          classData.forEach((clsData) => {
            console.log(
              this._formatClassDefinition({
                klassName: maybeKlassName,
                classData: clsData,
                metadata,
                isRueModule,
              })
            );
          });
        } else if (isUDFClass) {
          console.error(
            `Documentation was not found about '${maybeKlassName}' in REPL context. It may be a user-defined class.`
          );
        } else if (isStatic) {
          // maybeProto is methodName
          const klass = repl.context[maybeKlassName];
          const ownerKlass = Support.getOwnerFrom(klass, maybeProto);
          const ownerKlassName = ownerKlass['name'];
          const metadata = definitions[ownerKlassName]['metadata'];
          methodData = definitions[ownerKlassName]['static'][maybeProto];
          const isRueModule = ownerKlass['__rue_module__'];
          console.log(
            this._formatMethodDefinition({
              klassName: ownerKlassName,
              methodData,
              metadata,
              isRueModule,
            })
          );
        } else if (isUDFInstance) {
          methodName = maybeProto;
          const instance = this.evalInContext(maybeKlassName, repl.context);
          const ownerKlass = Support.getOwnerFrom(instance, methodName);
          const ownerKlassName = ownerKlass['name'];
          methodData = definitions[ownerKlassName]['instance'][methodName];
          const metadata = definitions[ownerKlassName]['metadata'];
          const isRueModule = ownerKlass['__rue_module__'];

          console.log(
            this._formatMethodDefinition({
              klassName: ownerKlassName,
              methodData,
              metadata,
              isRueModule,
            })
          );
        } else if (isInstance) {
          if (methodName == 'constructor') {
            methodData = definitions[maybeKlassName]['$constructor'];
            const metadata = definitions[maybeKlassName]['metadata'];
            const klass = repl.context[maybeKlassName];
            const isRueModule = klass['__rue_module__'];
            console.log(
              this._formatMethodDefinition({
                klassName: maybeKlassName,
                methodData,
                metadata,
                isRueModule,
              })
            );
          } else {
            const klass = repl.context[maybeKlassName];

            let instance;
            if (this.isPromisePrototype(klass)) {
              instance = new klass((_resolve, _reject) => {});
            } else {
              instance = new klass();
            }

            const ownerKlass = Support.getOwnerFrom(instance, methodName);
            const ownerKlassName = ownerKlass['name'];
            methodData = definitions[ownerKlassName]['instance'][methodName];
            const metadata = definitions[ownerKlassName]['metadata'];
            const isRueModule = ownerKlass['__rue_module__'];
            console.log(
              this._formatMethodDefinition({
                klassName: ownerKlassName,
                methodData,
                metadata,
                isRueModule,
              })
            );
          }
        } else {
          console.error(
            `'${input}' is an unsupported format or does not exist on the REPL context.`
          );
        }
      } catch (e) {
        console.error(`'${input}' does not exist on the REPL context.`);
      }
    } else {
      console.error(`'undefined' does not exist on the REPL context.`);
    }
  }

  private static isPromisePrototype(klass): boolean {
    const ancestors = Support.getAncestors(klass);
    return ancestors.includes('Promise');
  }

  private static evalInContext(str: string, context: any) {
    return function () {
      try {
        return eval(`this.${str}`);
      } catch (e) {
        console.error(e);
      }
    }.call(context);
  }

  private static _formatClassDefinition({
    klassName,
    metadata,
    classData,
    isRueModule,
  }: {
    klassName: string;
    metadata: any;
    classData: any;
    isRueModule: boolean;
  }): string {
    const { filepath, updatedAt } = metadata;
    const { line, highlightText } = classData;
    const owner = isRueModule ? `${klassName} (RueModule)` : klassName;
    const titleFn = chalk.white.bold;
    const msg = `
${titleFn('From:')} ${filepath}#L${line[0]}-${line[1]}
${titleFn('Owner:')} ${owner}
${titleFn('Number of lines:')} ${line[1] - line[0] + 1}
${titleFn('Updated At:')} ${updatedAt}

${highlightText}`;

    return msg;
  }

  private static _formatMethodDefinition({
    klassName,
    metadata,
    methodData,
    isRueModule,
  }: {
    klassName: string;
    metadata: any;
    methodData: any;
    isRueModule: boolean;
  }): string {
    const { filepath, updatedAt } = metadata;
    const { visibility, isAsync, line, highlightText } = methodData;
    const owner = isRueModule ? `${klassName} (RueModule)` : klassName;
    const titleFn = chalk.white.bold;
    const space = '  ';
    let msg;
    if (visibility || isAsync) {
      msg = `
${titleFn('From:')} ${filepath}#L${line[0]}-${line[1]}
${titleFn('Owner:')} ${owner}
${titleFn('Visibility:')} ${visibility}
${titleFn('Async:')} ${isAsync}
${titleFn('Number of lines:')} ${line[1] - line[0] + 1}
${titleFn('Updated At:')} ${updatedAt}

${space}${highlightText}`;
    } else {
      msg = `
${titleFn('From:')} ${filepath}#L${line[0]}-${line[1]}
${titleFn('Owner:')} ${owner}
${titleFn('Number of lines:')} ${line[1] - line[0] + 1}
${titleFn('Updated At:')} ${updatedAt}

${space}${highlightText}`;
    }

    return msg;
  }
}
