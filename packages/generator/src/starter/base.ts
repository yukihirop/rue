// third party
import recursive from 'recursive-readdir';

// builtin
import fs from 'fs';
import path from 'path';

// types
import * as t from './types';

const currentDir = process.cwd();

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
        fs.rmSync(outputDirPath, { recursive: true });
      } else {
        console.error(`❗️ [Rue] The directory exists in '${outputDirPath}'`);
      }
    }

    const templateDirPath = this.getTemplateDir(extname);
    let files = await recursive(templateDirPath);
    files = files.sort();

    console.log(`✨ [Rue] Generate Rue Starter`);
    
    files.forEach((file) => {
      const dir = path.dirname(file);
      if (!force && !fs.existsSync(dir)) {
        fs.mkdirSync(outputDirPath, { recursive: true });
      }

      const relativePath = path.relative(templateDirPath, file);
      const destPath = `${outputDirPath}/${relativePath}`;
      fs.copyFileSync(file, destPath);
      console.log(`✨ [Rue] Generate '${outputDirPath}/${relativePath}'`);
    });
  }

  private static getTemplateDir(extname: t.ExtName): string {
    if (extname == 'ts') {
      return path.join(currentDir, 'template', extname);
    } else {
      console.error(`💥 [Rue] '${extname}' is an unsupported extension.`);
    }
  }
}
