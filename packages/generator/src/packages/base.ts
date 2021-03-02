// builtin
import path from 'path';
import fs from 'fs';

// locals
import * as activemodel from './activemodel';
import * as activerecord from './acitverecord';
import * as activeform from './activeform';

// types
import * as t from './types';

export class Generator$Packages$Base {
  static async generate({
    outputDirPath,
    pkgName,
    extname,
    force,
  }: {
    outputDirPath: string;
    pkgName: t.PkgName;
    extname: t.ExtName;
    force: boolean;
  }) {
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    const savePath = path.join(outputDirPath, `${pkgName}.${extname}`);

    if (!force && fs.existsSync(savePath)) {
      console.log(`❗️ [Rue] The file exists in '${savePath}'`);
    } else {
      const template = this.getTemplate(pkgName, extname);
      console.log(`✨ [Rue] Create '${pkgName}' in '${savePath}'`);
      fs.writeFileSync(savePath, template);
    }
  }

  private static getTemplate(pkgName: t.PkgName, extname: t.ExtName): string {
    if (extname == 'js') {
      return this.getPkg(pkgName).defaultJSTemplate;
    } else if (extname == 'ts') {
      return this.getPkg(pkgName).defaultTSTemplate;
    } else {
      console.error(`💥 [Rue] '${extname}' is an unsupported extension.`);
    }
  }

  private static getPkg(pkgName: t.PkgName) {
    if (pkgName === 'activerecord') {
      return activerecord;
    } else if (pkgName === 'activemodel') {
      return activemodel;
    } else if (pkgName === 'activeform') {
      return activeform;
    }
  }
}
