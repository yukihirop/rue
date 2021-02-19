// rue packages
import { Repl } from '@rue/repl';

// third party
import { Command, flags } from '@oclif/command';

const projectRoot = require('pkg-dir').sync() || process.cwd();
const isTypeScript = require('fs').existsSync(require('path').join(projectRoot, 'tsconfig.json'));

export default class Console extends Command {
  static description = 'Run the Rue console REPL';

  private static replOptions = {
    prompt: '🍛 > ',
    useColors: true,
  };

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
    Repl.run(Console.replOptions);
  }
}
