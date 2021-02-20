// builtin
import path from 'path';

// third party
import { watch } from 'chokidar';

// locals
import { Repl } from '@/repl';

// types
import * as ast from '@rue/activesupport';
import * as replt from 'repl';

// this is bound to an instance(class) of Repl(Core)
export const FileWatchers: ast.Support$Module = {
  isModule: true,

  // @static
  async setupFileWatchers(repl: replt.REPLServer) {
    const _this = this as typeof Repl;

    const watchers = [
      watch(await _this.getRueModulePaths(), {
        ignoreInitial: true,
      }).on('all', (event, filepath) => {
        console.log(`\n[Rue] File ${event} at ${path.relative(_this.projectRoot, filepath)}`);
        _this.loadRueModulesForREPL(repl);
      }),
    ];

    repl.on('reset', () => _this.loadRueModulesForREPL(repl));
    repl.on('exit', () => watchers.forEach((watcher) => watcher.close()));
  },
};
