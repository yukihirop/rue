// rue packages
import { Generator$MockServer } from '@rue/generator';

// third party
import { Command } from '@oclif/command';

export default class MockGenerate extends Command {
  static description = "Generate 'mock <server>' in your project";
  static aliases = ['mg'];

  static args = [
    {
      name: 'compName',
      required: true,
      description: 'component name',
      options: ['server'],
    },
    {
      name: 'fileType',
      required: false,
      description: 'file type',
      options: ['db', 'routes'],
    },
  ];

  async run() {
    const { args } = this.parse(MockGenerate);

    if (args.compName === 'server') {
      if (args.fileType === 'db') {
        Generator$MockServer.generateDB();
      } else if (args.fileType === 'routes') {
        Generator$MockServer.generateRoutes();
      } else {
        Generator$MockServer.generateDB();
        Generator$MockServer.generateRoutes();
      }
    }
  }
}
