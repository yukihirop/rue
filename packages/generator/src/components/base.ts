// builtin
import path from 'path';
import fs from 'fs';

// locals
import template from './template';

// types
import * as t from './types';

export class Generator$Components$Base {
  static async generate({
    outputDirPath,
    compName,
    className,
    params,
    extname,
    force,
  }: {
    outputDirPath: string;
    compName: t.ComponentName;
    className: string;
    params: t.Params;
    extname: t.ExtName;
    force: boolean;
  }) {
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    const savePath = path.join(outputDirPath, `${className}.${extname}`);

    if (!force && fs.existsSync(savePath)) {
      console.log(`[Rue] The file exists in '${savePath}'`);
    } else {
      const template = this.getTemplate(compName, extname);
      fs.writeFileSync(savePath, template.build({ className, params }));
      console.log(`[Rue] Create '${className}' in '${savePath}'`);
    }
  }

  private static getTemplate(compName: t.ComponentName, extname: t.ExtName) {
    if (extname == 'js') {
      return this.getComponent(compName).defaultJS;
    } else if (extname == 'ts') {
      return this.getComponent(compName).defaultTS;
    } else {
      console.error(`[Rue] '${extname}' is an unsupported extension.`);
    }
  }

  private static getComponent(compName: t.ComponentName) {
    if (compName === 'record') {
      return template.record;
    } else if (compName === 'model') {
      return template.model;
    } else if (compName === 'form') {
      return template.form;
    }
  }
}
