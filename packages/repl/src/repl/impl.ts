// rue packages
import { Support, Support$ImplBase } from '@rue/activesupport';

// locals
import { HistoryModule, FileWatchersModule } from './modules';

// types
import * as replt from 'repl';
import * as t from '@/repl/types';
import * as ast from '@rue/activesupport';

abstract class Impl {
  // Prepared for checking with hasOwnProperty ()
  static __rue_abstract_class__ = Support$ImplBase.__rue_abstract_class__;

  // HistoryModule
  static setupHistory: (repl: replt.REPLServer) => void;
  static setupFileWatchers: (repl: replt.REPLServer, modules?: t.Modules) => Promise<void>;
}

interface Impl {}

// extend module
Support.rueModuleExtend(Impl, HistoryModule, { only: ['setupHistory'] });
Support.rueModuleExtend(Impl, FileWatchersModule, { only: ['setupFileWatchers'] });

export { Impl };
