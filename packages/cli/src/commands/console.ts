// rue packages
import { Repl$Base as Repl } from '@ruejs/repl';
import { Config$Base as Config } from '@ruejs/config';

// third party
import { Command, flags } from '@oclif/command';

// builtin
import path from 'path';

const projectRoot = require('pkg-dir').sync() || process.cwd();
const isTypeScript = require('fs').existsSync(path.join(projectRoot, 'tsconfig.json'));

export default class Console extends Command {
  static description = 'Run the Rue console REPL';

  private static setupTSNode() {
    require('ts-node').register({
      compilerOptions: {
        module: 'commonjs',
      },
    });
    require('tsconfig-paths/register');
  }

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Console);

    if (isTypeScript) Console.setupTSNode();
    Repl.run(Config.nodeREPL());
  }
}
