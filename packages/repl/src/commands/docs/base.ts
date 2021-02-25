// rue packages
import docs from '@rue/docs';

// third party
import chalk from 'chalk';

// types
import * as replt from 'repl';

export class Repl$Commands$Docs$Base {
  static displayDefinition(input: string, repl: replt.REPLServer) {
    if (input) {
      try {
        let [maybeKlassName, maybeProto, methodName] = input.split('.');

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

        if (isStatic) {
          // maybeProto is methodName
          const metadata = docs[maybeKlassName]['metadata'];
          methodData = docs[maybeKlassName]['static'][maybeProto];
          console.log(this._formatDefinition({ klassName: maybeKlassName, methodData, metadata }));
        } else if (isInstance) {
          const metadata = docs[maybeKlassName]['metadata'];
          methodData = docs[maybeKlassName]['instance'][methodName];
          console.log(this._formatDefinition({ klassName: maybeKlassName, methodData, metadata }));
        } else if (isUDFInstance) {
          const instance = this.evalInContext(maybeKlassName, repl.context);
          const klassName = instance.constructor.name;
          // maybeProto is methodName
          console.error(
            `Documentation was not found about '${klassName}.prototype.${maybeProto}' in REPL context. It may be a user-defined class.`
          );
        } else {
          console.error(
            `'${input}' is an unsupported format or does not exist on the REPL context.`
          );
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error(`'undefined' does not exist on the REPL context.`);
    }
  }

  static evalInContext(str: string, context: any) {
    return function () {
      try {
        return eval(`this.${str}`);
      } catch (e) {
        console.error(e);
      }
    }.call(context);
  }

  private static _formatDefinition({
    klassName,
    metadata,
    methodData,
  }: {
    klassName: string;
    metadata: any;
    methodData: any;
  }): string {
    const { filepath, updatedAt } = metadata;
    const { visibility, isAsync, line, highlightText } = methodData;
    const titleFn = chalk.white.bold;
    const space = '  ';
    const msg = `
${titleFn('From:')} ${filepath}#L${line[0]}-${line[1]}
${titleFn('Owner:')} ${klassName}
${titleFn('Visibility:')} ${visibility}
${titleFn('Async:')} ${isAsync}
${titleFn('Number of lines:')} ${line[1] - line[0] + 1}
${titleFn('Updated At:')} ${updatedAt}

${space}${highlightText}`;

    return msg;
  }
}
