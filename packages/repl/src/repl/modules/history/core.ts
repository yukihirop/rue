// rue packages
import { Support } from '@rue/activesupport';

// builtin
import path from 'path';
import os from 'os';
import fs from 'fs';

// types
import * as replt from 'repl';

// this is bound to an instance(class) of Repl
export const History = Support.defineRueModule('Repl$History', {
  constant: {
    HISTORY_FILE: '.rue-console-history',
  },

  static: {
    setupHistory(repl: replt.REPLServer) {
      const consoleHistoryPath = path.join(this.projectRoot, History.constant.HISTORY_FILE);
      if (repl.setupHistory) {
        repl.setupHistory(consoleHistoryPath, () => {});
      } else {
        History.static._setupSelfRolledHistory(repl, consoleHistoryPath);
      }
    },

    _setupSelfRolledHistory(repl: replt.REPLServer, historyPath: string) {
      function init() {
        try {
          const history = fs.readFileSync(historyPath, { encoding: 'utf8' });
          const nonEmptyLines = history.split(os.EOL).filter((line) => line.trim());
          // @ts-ignore
          repl.history.push(...nonEmptyLines.reverse());
        } catch (err) {
          if (err.code != 'ENOENT') {
            throw err;
          }
        }
      }

      function onExit() {
        // @ts-ignore
        const addedHistory = repl.lines.join(os.EOL);
        fs.appendFileSync(historyPath, addedHistory);
      }

      init();
      repl.on('exit', onExit);
    },
  },
});
