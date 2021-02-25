// builtin
import fs from 'fs';
import path from 'path';

// third party
import { TypescriptParser, getVisibilityText } from 'typescript-parser';
import globby from 'globby';
import dayjs from 'dayjs';

// locals
import { Highlighter } from './highlighter';

// types
import type * as t from './types';
import type * as tpt from 'typescript-parser';

export class Generator$Docs$Base {
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

    let result = {};

    const parsedPromiseFn = async (filepath: string): Promise<[tpt.File, string]> => {
      const parsed = await this.parser.parseFile(filepath, cwd);
      return Promise.resolve([parsed, filepath]);
    };

    console.log(`[Rue] Generate Docs | { package: '${pkgName}', output: '${outputPath}' }`);

    Promise.all(paths.map(parsedPromiseFn))
      .then((parsedArr) => {
        parsedArr.forEach((parsedData) => {
          const [parsed, filepath] = parsedData;
          const tsText = fs.readFileSync(filepath as string, 'utf8');

          parsed.declarations.forEach((declaration: tpt.ClassDeclaration) => {
            const klassName = declaration.name;
            const methodDecs = declaration.methods;

            if (methodDecs) {
              methodDecs.forEach((methodDec: tpt.MethodDeclaration) => {
                const { start, end, name: methodName, isStatic, isAsync, visibility } = methodDec;
                const methodText = tsText.substr(start, end - start);
                const metadata = {
                  filepath: `${this.basePath}/${pkgName}/${filepath}`,
                  updatedAt: dayjs().format(this.dateFormat),
                };
                const methodData = {
                  [methodName]: {
                    text: methodText,
                    highlightText: this._highlight(methodText),
                    isAsync,
                    visibility: getVisibilityText(visibility) || 'public',
                    line: this._makeLineData(tsText, methodText),
                  },
                };
                let methodType = isStatic ? 'static' : 'instance';
                if (isStatic) {
                  console.log(
                    `[Rue] Generate Docs | generate docs: '${klassName}.${methodName}' from '${filepath}'`
                  );
                } else {
                  console.log(
                    `[Rue] Generate Docs | generate docs: '${klassName}.prototype.${methodName}' from '${filepath}'`
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
          });
        });
      })
      .then(() => {
        const fullOutputPath = path.join(cwd, outputPath);
        console.log(`[Rue] Generate Docs | save docs at '${outputPath}'`);
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