// rue packages
import { Support$ImplBase } from '@rue/activesupport';

// locals
import { HistoryModule, FileWatchersModule } from './modules';

// types
import * as replt from 'repl';
import * as t from '@/repl/types';

abstract class Impl {
  // Prepared for checking with hasOwnProperty ()
  static __rue_abstract_class__ = Support$ImplBase.__rue_abstract_class__;

  // HistoryModule
  static HISTORY_FILE = HistoryModule.HISTORY_FILE;
  static setupHistory: (repl: replt.REPLServer) => void;
  static setupFileWatchers: (repl: replt.REPLServer, modules?: t.Modules) => Promise<void>;
}

interface Impl {}

// extend module
HistoryModule.rueModuleExtendedFrom(Impl, { only: ['setupHistory', 'HISTORY_FILE'] });
FileWatchersModule.rueModuleExtendedFrom(Impl, { only: ['setupFileWatchers'] });

export { Impl };
