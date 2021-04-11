// @ruejs/packages
import { Config$Base as Config } from '@ruejs/config';

// third party
import { Command } from '@oclif/command';

// buitin
import fs from 'fs';
import path from 'path';

const configFileName = Config.fileName;
const projectRoot = require('pkg-dir').sync() || process.cwd();
const savePath = path.join(projectRoot, Config.fileName);
const relativeSavePath = path.resolve(projectRoot, savePath);

export default class Init extends Command {
  static description = `Create '${configFileName}' in project root`;

  async run() {
    this.parse(Init);

    if (fs.existsSync(savePath)) {
      console.log(`❗️ [Rue] The configuration file exists in '${relativeSavePath}'`);
    } else {
      console.log(`✨ [Rue] Create '${configFileName}' in '${relativeSavePath}'`);
      fs.writeFileSync(savePath, Config.defaultJS);
    }
  }
}
