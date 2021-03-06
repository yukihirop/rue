// builtin
import fs from 'fs';
import path from 'path';

// third party
import { TypescriptParser, getVisibilityText } from 'typescript-parser';
import globby from 'globby';
import dayjs from 'dayjs';

// locals
import { Generator$Definitions$Highlighter as Highlighter } from './highlighter';

// types
import type * as t from './types';
import type * as tpt from 'typescript-parser';

export class Generator$Definitions$Base {
  private static parser = new TypescriptParser();
  private static basePath = '@rue/packages';
  private static dateFormat = 'YYYY/MM/DD HH:mm:ss Z';

  static async generate(
    filepaths: t.GlobbyFilePaths,
    {
      outputPath,
      cwd,
      pkgName,
    }: { outputPath: string; cwd: t.GlobbyCurrentDirectoryPath; pkgName: string }
  ) {
    const paths = await globby(filepaths, {
      cwd,
      gitignore: true,
    });

    let result = {} as t.ClassDoc;

    const parsedPromiseFn = async (filepath: string): Promise<[tpt.File, string]> => {
      const parsed = await this.parser.parseFile(filepath, cwd);
      return Promise.resolve([parsed, filepath]);
    };

    console.log(`[Rue] Generate Definition | { package: '${pkgName}', output: '${outputPath}' }`);

    Promise.all(paths.map(parsedPromiseFn))
      .then((parsedArr) => {
        parsedArr.forEach((parsedData) => {
          const [parsed, filepath] = parsedData;
          const tsText = fs.readFileSync(filepath as string, 'utf8');
          const metadata = {
            filepath: `${this.basePath}/${pkgName}/${filepath}`,
            updatedAt: dayjs().format(this.dateFormat),
          };

          parsed.declarations.forEach((classDec: tpt.ClassDeclaration) => {
            const {
              name: klassName,
              start,
              end,
              methods: methodDecs,
              ctor: constructorDec,
            } = classDec;

            if (constructorDec || methodDecs) {
              // Class Definitions
              const classText = tsText.substr(start, end - start);
              console.log(
                `[Rue] Generate Definition | generate definition: '${klassName}' from '${filepath}'`
              );

              const classData = {
                text: classText,
                highlightText: this._highlight(classText),
                line: this._makeLineData(tsText, classText),
              };

              // Basically it is prohibited, but like the Impl class, there may be multiple definitions in one file.
              if (!result[klassName] || !result[klassName].class) {
                this._mergeDeep(result, {
                  [klassName]: {
                    metadata,
                    class: [classData],
                  },
                });
              } else {
                result[klassName].class.push(classData);
              }

              // Methods Definitions
              methodDecs.forEach((methodDec: tpt.MethodDeclaration) => {
                const { start, end, name: methodName, isStatic, isAsync, visibility } = methodDec;
                const methodText = tsText.substr(start, end - start);
                const methodData = {
                  [methodName]: {
                    text: methodText,
                    highlightText: this._highlight(methodText),
                    isAsync,
                    visibility: getVisibilityText(visibility) || 'public',
                    line: this._makeLineData(tsText, methodText),
                  },
                };
                const methodType = isStatic ? 'static' : 'instance';
                if (isStatic) {
                  console.log(
                    `[Rue] Generate Definition | generate definition: '${klassName}.${methodName}' from '${filepath}'`
                  );
                } else {
                  console.log(
                    `[Rue] Generate Definition | generate definition: '${klassName}.prototype.${methodName}' from '${filepath}'`
                  );
                }
                this._mergeDeep(result, {
                  [klassName]: {
                    metadata,
                    [methodType]: methodData,
                  },
                });
              });
            }

            // Constructor Definitions
            if (constructorDec) {
              const { start: startCon, end: endCon } = constructorDec;
              const constructorText = tsText.substr(startCon, endCon - startCon);
              console.log(
                `[Rue] Generate Definition | generate definition: '${klassName}.prototype.constructor' from '${filepath}'`
              );
              this._mergeDeep(result, {
                [klassName]: {
                  metadata,
                  $constructor: {
                    text: constructorText,
                    highlightText: this._highlight(constructorText),
                    line: this._makeLineData(tsText, constructorText),
                  },
                },
              });
            }
          });
        });
      })
      .then(() => {
        const fullOutputPath = path.join(cwd, outputPath);
        console.log(`[Rue] Generate Definition | save at '${outputPath}'`);
        fs.writeFileSync(fullOutputPath, JSON.stringify(result, null, 2));
      });
  }

  private static _makeLineData(tsText: string, methodCode: string): [number, number] {
    const tsLines = tsText.split('\n');
    const methodLines = methodCode.split('\n');
    const startMethodLine = methodLines[0];
    const endMethodLine = methodLines.splice(-1)[0];

    let startLine = 0;
    let endLine = 0;
    let foundEndLine = false;
    let foundStartLine = false;

    tsLines.forEach((line, index) => {
      if (!foundStartLine && line.indexOf(startMethodLine) !== -1) {
        startLine = index + 1;
        foundStartLine = true;
      }
      if (!foundEndLine && foundStartLine && line.indexOf(endMethodLine) === 0) {
        endLine = index + 1;
        foundEndLine = true;
      }
    });

    return [startLine, endLine];
  }

  private static _highlight(sourceCode: string): string {
    return Highlighter.highlight(sourceCode);
  }

  private static _mergeDeep(target: object, ...sources): object {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this._isObject(target) && this._isObject(source)) {
      for (const key in source) {
        if (this._isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this._mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this._mergeDeep(target, ...sources);
  }

  private static _isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}
