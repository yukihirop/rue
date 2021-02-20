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
import { Impl } from './impl';

// types
import type * as t from './types';

export class Core extends Impl {
  static projectRoot: string = pkgDir.sync() || process.cwd();
  // https://github.com/standard-things/esm/issues/154#issuecomment-499106152
  private static esmRequire = require('esm')(module, { cjs: { topLevelReturn: true } });
  private static PROGRESS_BAR_MESSAGE = '[Rue] Loading Rue Modules :current/:total';

  static async run(opts: replt.ReplOptions) {
    const repl = await this.initializeREPL(opts);
    repl.on('exit', () => process.exit());
    await this.setupFileWatchers(repl);
  }

  static async getRueModulePaths(): Promise<string[]> {
    const paths = await globby(['src/**/{forms,models,records}/**/*.{js,ts}'], {
      cwd: Core.projectRoot,
      gitignore: true,
    });

    return [...paths.map((p) => path.join(Core.projectRoot, p))];
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
    Core.resolveModuleAliases();

    const modules = await this.loadRueModules();
    const repl = REPL.start(opts);

    this.loadRueModulesForREPL(repl, modules);
    this.setupHistory(repl);

    return repl;
  }

  // ref: https://github.com/kenotron/simple-esm-module-alias/blob/master/index.js
  private static resolveModuleAliases() {
    // TODO: Use @rue/config
    Core.esmRequire('module-alias').addAliases({
      '@': Core.projectRoot + '/src',
    });
  }

  private static async loadRueModules(): Promise<t.Modules> {
    const paths = await this.getRueModulePaths();
    const percentage = new ProgressBar(Core.PROGRESS_BAR_MESSAGE, {
      total: paths.length,
    });

    const modules: t.Modules = Object.assign(
      {},
      ...paths.map((modulePath) => {
        let name = path.parse(modulePath).name;

        if (name === 'index') {
          const dirs = path.dirname(modulePath).split(path.sep);
          name = dirs[dirs.length - 1];
        }

        try {
          const module = this.forceRequire(modulePath);
          const contextObj = module.default || module;

          percentage.tick();

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
    delete require.cache[require.resolve(modulePath)];
    return Core.esmRequire(modulePath);
  }
}
