// third party
import recursive from 'recursive-readdir';
import rimraf from 'rimraf';

// builtin
import fs from 'fs';
import path from 'path';

// types
import * as t from './types';

export class Generator$Starter$Base {
  static async generate({
    outputDirPath,
    extname,
    force,
  }: {
    outputDirPath: string;
    extname: t.ExtName;
    force: boolean;
  }) {
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    } else {
      if (force) {
        rimraf.sync(outputDirPath);
      } else {
        console.error(`💥 [Rue] The directory exists in '${outputDirPath}'`);
        process.exit(1);
      }
    }

    const templateDirPath = this.getTemplateDir(extname);
    let files = await recursive(templateDirPath);
    files = files.sort();

    console.log(`✨ [Rue] Generate Rue Starter 💫`);

    files.forEach((file) => {
      const relativePath = path.relative(templateDirPath, file);
      const destPath = path.resolve(`${outputDirPath}/${relativePath}`);
      const dir = path.dirname(destPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.copyFileSync(file, destPath);
      console.log(`✨ [Rue] create '${outputDirPath}/${relativePath}'`);
    });
  }

  private static getTemplateDir(extname: t.ExtName): string {
    if (extname == 'ts') {
      const pathInlib = path.join(__dirname, 'template', extname);
      return pathInlib.replace('/lib/', '/src/');
    } else {
      console.error(`💥 [Rue] '${extname}' is an unsupported extension.`);
    }
  }
}
