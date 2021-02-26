// rue packages
import { RueModule } from '@rue/activesupport';

// builtin
import path from 'path';

// third party
import { watch } from 'chokidar';

// types
import * as replt from 'repl';

// this is bound to an instance(class) of Repl(Core)
export class Repl$FileWatchers extends RueModule {
  static async setupFileWatchers(repl: replt.REPLServer) {
    const _this = this as any;

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
  }
}
