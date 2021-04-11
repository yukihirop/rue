// rue packages
import { ActiveSupport$ImplBase as Support$ImplBase } from '@ruejs/activesupport';

// locals
import { Repl$History, Repl$FileWatchers } from './modules';

// types
import * as replt from 'repl';
import * as t from '@/repl/types';

abstract class Repl$Impl {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = Support$ImplBase.__rue_impl_class__;

  // HistoryModule
  static HISTORY_FILE = Repl$History.HISTORY_FILE;
  static setupHistory: (repl: replt.REPLServer) => void;
  static setupFileWatchers: (repl: replt.REPLServer, modules?: t.Modules) => Promise<void>;
}

interface Repl$Impl {}

// extend module
Repl$History.rueModuleExtendedFrom(Repl$Impl, { only: ['setupHistory', 'HISTORY_FILE'] });
Repl$FileWatchers.rueModuleExtendedFrom(Repl$Impl, { only: ['setupFileWatchers'] });

export { Repl$Impl };
