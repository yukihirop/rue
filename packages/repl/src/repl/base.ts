// rue/packages
import { Config$Base as Config, Rue } from '@ruejs/config';

// builtin
import * as REPL from 'repl';
import { REPLServer } from 'repl';
import path from 'path';

// bultin types
import type * as replt from 'repl';

// third party
import globby from 'globby';
import pkgDir from 'pkg-dir';
import ProgressBar from 'progress';

// locals
import { Repl$Impl } from './impl';
import { defineCommands } from '@/commands';

// types
import type * as t from './types';

const projectRoot = pkgDir.sync() || process.cwd();
const rueREPLConfig = Config.rueREPL();
const moduleAliases = Object.keys(rueREPLConfig.moduleAliases).reduce((acc, alias) => {
  acc[alias] = path.resolve(projectRoot, rueREPLConfig.moduleAliases[alias]);
  return acc;
}, {});

export class Repl$Base extends Repl$Impl {
  static projectRoot: string = projectRoot;
  // https://github.com/standard-things/esm/issues/154#issuecomment-499106152
  private static esmRequire = require('esm')(module, { cjs: { topLevelReturn: true } });
  private static PROGRESS_BAR_MESSAGE = '[Rue] Loading Rue Modules :current/:total.';

  static async run(opts: replt.ReplOptions) {
    const repl = await this.initializeREPL(opts);
    repl.on('exit', () => process.exit());
    await this.setupFileWatchers(repl);
  }

  static async getRueModulePaths(): Promise<string[]> {
    /**
     * When checking locally, it is necessary to be able to dynamically return the root path
     * because it refers to the globally installed package by yarn link.
     */
    const pkgRootPath = rueREPLConfig.ruePackageRootPath || Repl$Base.projectRoot;
    const buildPaths = await globby(
      [
        `node_modules/@ruejs/activesupport/lib/**/*.js`,
        `node_modules/@ruejs/activemodel/lib/**/*.js`,
        `node_modules/@ruejs/activerecord/lib/**/*.js`,
        `!node_modules/@ruejs/activesupport/{src,lib}/**/__tests__/**/*.test.{js,ts}`,
        `!node_modules/@ruejs/activemodel/{src,lib}/**/__tests__/**/*.test.{js,ts}`,
        `!node_modules/@ruejs/activerecord/{src,lib}/**/__tests__/**/*.test.{js,ts}`,
        // Duplicate name does not load correctly
        `!node_modules/@ruejs/activemodel/{src,lib}/**/validators/*.{js,ts}`,
        // Avoid matching the test code in the rue package
        `!node_modules/@ruejs/**/src/**/__tests__/**/*.test.{js,ts}`,
      ],
      {
        cwd: pkgRootPath,
        gitignore: true,
      }
    );

    const udfPaths = await globby(rueREPLConfig['loadModules'], {
      cwd: Repl$Base.projectRoot,
      gitignore: true,
    });

    const paths = [
      ...buildPaths.map((p) => `${pkgRootPath}/${p}`),
      ...udfPaths.map((p) => `${Repl$Base.projectRoot}/${p}`),
    ];
    return paths;
  }

  static async loadRueModulesForREPL(repl: REPLServer, modules?: t.Modules) {
    if (modules && Object.keys(modules).length > 0) {
      Object.assign(repl.context, modules);
    } else {
      const modules = await this.loadRueModules();
      Object.assign(repl.context, modules);
    }
  }

  private static async initializeREPL(opts: replt.ReplOptions): Promise<replt.REPLServer> {
    Repl$Base.loadDotEnv();
    Repl$Base.resolveModuleAliases();
    Repl$Base.esmRequire(path.join(projectRoot, rueREPLConfig.bootstrapPath));

    console.log(`[Node] Welcome to Node.js v${process.env.NODENV_VERSION}.`);
    console.log(`[Node] Type ".help" for more information.`);

    const modules = await this.loadRueModules();
    const repl = REPL.start(opts);

    this.loadRueModulesForREPL(repl, modules);
    this.setupHistory(repl);
    defineCommands(repl);

    return repl;
  }

  private static loadDotEnv() {
    require('dotenv').config({ path: path.join(projectRoot, rueREPLConfig.dotEnvPath) });
  }

  // ref: https://github.com/kenotron/simple-esm-module-alias/blob/master/index.js
  private static resolveModuleAliases() {
    // TODO: Use @ruejs/config
    Repl$Base.esmRequire('module-alias').addAliases(moduleAliases);
  }

  static async loadRueModules(): Promise<t.Modules> {
    const paths = await this.getRueModulePaths();
    const percentage = new ProgressBar(Repl$Base.PROGRESS_BAR_MESSAGE, {
      total: paths.length,
    });

    const modules: t.Modules = Object.assign(
      { Rue }, // runtime config
      ...paths.map((modulePath) => {
        let name = path.parse(modulePath).name;

        if (name === 'index') {
          const dirs = path.dirname(modulePath).split(path.sep);
          name = dirs[dirs.length - 1];
        }

        try {
          const module = this.forceRequire(modulePath);
          let contextObj = module.default || module;
          // Use as to name the name before returning
          const defaultName = Object.keys(contextObj)[0];
          if (defaultName) {
            const maybeFn = contextObj[defaultName];
            const rename = maybeFn['name'];
            if (rename && typeof maybeFn === 'function' && Object.keys(module).length == 1) {
              percentage.tick();
              contextObj = { [rename]: maybeFn };
            } else {
              contextObj = {};
            }
          }

          return contextObj;
        } catch (e) {
          console.error(e);
          return {};
        }
      })
    );

    percentage.terminate();

    return modules;
  }

  private static forceRequire(modulePath: string): any {
    if (require.cache[modulePath]) {
      return require.cache[modulePath].exports;
    } else {
      return Repl$Base.esmRequire(modulePath);
    }
  }
}
