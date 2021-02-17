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

// types
import type * as t from './types';

export class Core {
  private static projectRoot: string = pkgDir.sync() || process.cwd();
  private static esmRequire = require('esm')(module);
  private static PROGRESS_BAR_MESSAGE = 'Loading Rue Modules :current/:total';

  static async run(opts: replt.ReplOptions) {
    const repl = await this.initializeREPL(opts);
    repl.on('exit', () => process.exit());
  }

  private static async initializeREPL(opts: replt.ReplOptions) {
    const modules = await this.loadRueModules();
    const repl = REPL.start(opts);

    this.loadRueModulesForREPL(repl, modules);

    return repl;
  }

  private static loadRueModulesForREPL(repl: REPLServer, modules: t.Modules) {
    Object.assign(repl.context, modules);
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

  private static async getRueModulePaths(): Promise<string[]> {
    const paths = await globby(['src/**/{forms,models,records}/**/*.{js,ts}'], {
      cwd: Core.projectRoot,
      gitignore: true,
    });

    return [...paths.map((p) => path.join(Core.projectRoot, p))];
  }

  private static forceRequire(modulePath: string): any {
    delete require.cache[require.resolve(modulePath)];
    return Core.esmRequire(modulePath);
  }
}
