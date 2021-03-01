// third party
import { js as beautify } from 'js-beautify';
import stringifyObject from 'stringify-object';

// builtin
import path from 'path';
import fs from 'fs';

// types
import * as t from './types';

const projectRoot = require('pkg-dir').sync() || process.cwd();

export class Config$Base {
  static fileName = 'rue.config.js';
  static default: t.RueConfig = {
    cli: {
      commands: {
        console: {
          nodeREPL: {
            prompt: '🍛 > ',
            useColors: true,
          },
        },
      },
    },
    repl: {
      loadModules: [
        'src/**/{forms,models,records}/**/*.{js,ts}',
        '!src/**/__tests__/*.test.{js,ts}',
      ],
      moduleAliases: {
        '@': './src',
      },
    },
  };
  static defaultJS: string = beautify(Config$Base.getJSConfig(Config$Base.default), {
    indent_size: 2,
    space_in_empty_paren: true,
    unescape_strings: false,
  });

  static all(): t.RueConfig {
    const loadedCofigPath = path.join(projectRoot, this.fileName);
    let config;

    if (fs.existsSync(loadedCofigPath)) {
      config = require(loadedCofigPath);
    } else {
      config = this.default;
    }

    return config;
  }

  static nodeREPL(): t.RueNodeREPLConfig {
    return this.all()['cli']['commands']['console']['nodeREPL'];
  }

  static rueREPL(): t.RueRueREPLConfig {
    return this.all()['repl'];
  }

  // https://stackoverflow.com/a/11233515/9434894
  // https://stackoverflow.com/a/53990000/9434894
  private static getJSConfig(config: t.RueConfig): string {
    return `
    module.exports = ${stringifyObject(config)};
    `;
  }
}