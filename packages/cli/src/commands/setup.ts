// rue packages
import { Generator$Packages, Generator$Starter } from '@ruejs/generator';

// third party
import { Command, flags } from '@oclif/command';

// builtin
import path from 'path';

const projectRoot = require('pkg-dir').sync() || process.cwd();
const isTypeScript = require('fs').existsSync(path.join(projectRoot, 'tsconfig.json'));
const defaultExtname = isTypeScript ? 'ts' : 'js';
export default class Setup extends Command {
  static description =
    "Setup '<activerecord|activemodel|activeform|bootstrap|starter>' in your project";

  static flags = {
    extname: flags.string({
      char: 'e',
      description: 'extname',
      required: false,
      options: ['js', 'ts'],
    }),
    force: flags.boolean({
      char: 'f',
      description: 'force update',
      required: false,
    }),
  };

  static args = [
    {
      name: 'pkgName',
      required: true,
      description: 'package name',
      options: ['activerecord', 'activemodel', 'activeform', 'bootstrap', 'starter'],
    },
    { name: 'saveDir', required: false, description: 'save dir path', default: './src/lib' },
  ];

  async run() {
    const { flags, args } = this.parse(Setup);

    try {
      if (args.pkgName === 'starter') {
        if (args.saveDir === './src/lib') args.saveDir = './src/rue';
        Generator$Starter.generate({
          outputDirPath: args.saveDir,
          extname: (flags.extname || defaultExtname) as 'js' | 'ts',
          force: flags.force,
        });
      } else {
        Generator$Packages.generate({
          outputDirPath: args.saveDir,
          pkgName: args.pkgName,
          extname: (flags.extname || defaultExtname) as 'js' | 'ts',
          force: flags.force,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
