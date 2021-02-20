// rue packages
// rue packages
import { Support } from '@rue/activesupport';

// locals
import { HistoryModule, FileWatchersModule } from './modules';

// builtin
import * as replt from 'repl';
import * as t from '@/repl/types';

class Impl {
  // HistoryModule
  static setupHistory: (repl: replt.REPLServer) => void;
  static setupFileWatchers: (repl: replt.REPLServer, modules?: t.Modules) => Promise<void>;
}

interface Impl {}

// extend module
Support.moduleExtend(Impl, HistoryModule, { only: ['setupHistory'] });
Support.moduleExtend(Impl, FileWatchersModule, { only: ['setupFileWatchers'] });

export { Impl };
