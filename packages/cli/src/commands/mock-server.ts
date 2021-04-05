// rue packages
import { Backend$MockServer } from '@rue/backend';

// third party
import { Command, flags } from '@oclif/command';

export default class MockServer extends Command {
  static description = 'Start the mock server in your project';
  static aliases = ['ms'];

  static flags = {
    port: flags.string({
      description: 'mock server port',
      required: false,
    }),
  };

  static args = [
    {
      name: 'subCommand',
      required: false,
      description: 'sub command',
      options: ['routes'],
    },
  ];

  async run() {
    try {
      const { flags, args } = this.parse(MockServer);
      if (!args.subCommand) {
        Backend$MockServer.createServer({ port: flags.port });
      } else if (args.subCommand === 'routes') {
        Backend$MockServer.printTable();
      }
    } catch (e) {
      console.error(
        'Rue is not available yet, make sure "yarn build" or "yarn dev" has completed compiling'
      );
      process.exit(1);
    }
  }
}
