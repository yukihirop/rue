// rue packages
import { Generator$Components } from '@ruejs/generator';

// third party
import { Command, flags } from '@oclif/command';

// builtin
import path from 'path';

// types
import type * as t from '@ruejs/generator';

const TYPESCRIPT_SUPPORT_PRIMITIVE_TYPES = [
  'boolean',
  'number',
  'string',
  'function',
  'bigint',
  'symbol',
  'undefined',
];
const TYPESCRIPT_SUPPORT_TYPES = [...TYPESCRIPT_SUPPORT_PRIMITIVE_TYPES, 'any'];
const projectRoot = require('pkg-dir').sync() || process.cwd();
const isTypeScript = require('fs').existsSync(path.join(projectRoot, 'tsconfig.json'));
const defaultExtname = isTypeScript ? 'ts' : 'js';

export default class Generate extends Command {
  static description = "Generate '<model|record|form>' in your project";
  static aliases = ['g'];

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
    saveDir: flags.string({
      char: 's',
      description: 'save dir path',
      required: false,
    }),
  };

  static args = [
    {
      name: 'compName',
      required: true,
      description: 'component name',
      options: ['model', 'record', 'form'],
    },
    {
      name: 'className',
      required: true,
      description: 'class name',
    },
    {
      name: 'params',
      required: false,
      description:
        "format is '<propName_A>:<propType_A>, <propName_B>:<propType_B>'. For example 'name:string, age:number'",
    },
  ];

  async run() {
    const { args, flags } = this.parse(Generate);

    try {
      Generator$Components.generate({
        outputDirPath: flags.saveDir || `./src/${args.compName}s`,
        compName: args.compName,
        className: args.className,
        params: this.parseParams(args.params),
        extname: (flags.extname || defaultExtname) as 'js' | 'ts',
        force: flags.force,
      });
    } catch (err) {
      console.error(err);
    }
  }

  private parseParams(params: string): t.Generator$Components$Params {
    const arr = params.split(',').map((d) => d.trim());
    const result = arr.reduce((acc, pair) => {
      const [propName, propType] = pair.split(':');
      if (TYPESCRIPT_SUPPORT_TYPES.includes(propType)) {
        acc[propName] = propType;
      } else {
        throw `💥 [Rue] Error: '${propType}' of '${pair}' is an unsupported typescript type in '${params}'`;
      }
      return acc;
    }, {});
    return result;
  }
}
