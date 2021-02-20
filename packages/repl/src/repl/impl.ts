// rue packages
// rue packages
import { Support } from '@rue/activesupport';

// builtin
import * as replt from 'repl';

import { HistoryModule } from './modules';

class Impl {
  // HistoryModule
  static setupHistory: (repl: replt.REPLServer) => void;
}

interface Impl {}

// extend module
Support.moduleExtend(Impl, HistoryModule, { only: ['setupHistory'] });

export { Impl };
