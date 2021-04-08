// rue packages
import { Backend$MockServer } from '@rue/backend';

// third party
import { Command, flags } from '@oclif/command';

export default class MockServer extends Command {
  static description = 'Start the mock server in your project';
  static aliases = ['ms'];

  static flags = {
    port: flags.integer({
      description: 'mock server port',
      required: false,
    }),
    method: flags.string({
      char: 'm',
      description: 'mock server method',
      required: false,
      options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'get', 'post', 'put', 'delete', 'patch'],
    }),
    resource: flags.string({
      char: 'r',
      description: 'mock server resource',
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
        console.log(`🚀[Rue] Start mock server on http://localhost:${flags.port}`);
        Backend$MockServer.printAvailableResources({ port: flags.port });
        Backend$MockServer.createServer({ port: flags.port });
      } else if (args.subCommand === 'routes') {
        let method = flags.method ? flags.method.toUpperCase() : undefined;
        Backend$MockServer.printTable({
          method,
          resource: flags.resource,
        });
      }
    } catch (e) {
      console.log(e);
      console.error(
        '💥[Rue] Rue is not available yet, make sure "yarn build" or "yarn dev" has completed compiling'
      );
      process.exit(1);
    }
  }
}
