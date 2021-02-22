// functions
import { rueModuleExtend } from '@/modules';

// modules
import { InfoModule } from './modules';

// types
import * as mit from './modules/info';

export abstract class ActiveSupport$ImplBase {
  // Prepared for checking with hasOwnProperty ()
  static __rue_abstract_class__ = true;
}

abstract class ActiveSupport$Impl extends ActiveSupport$ImplBase {
  // Prepared for checking with hasOwnProperty ()
  static __rue_abstract_class__ = ActiveSupport$ImplBase.__rue_abstract_class__;

  static getMethods: (obj?: Function) => string[];
  static getMethodsWithNamespace: (obj?: Function) => mit.Info$MethodWithNamespace;
  static getProperties: (obj?: Function) => string[];
  static getAncestors: <T = string>(obj?: Function | object, transformer?: (obj: Function) => T) => T[];
}

interface ActiveSupport$Impl {}

// module extend
rueModuleExtend(ActiveSupport$Impl, InfoModule, {
  only: ['getMethods', 'getMethodsWithNamespace', 'getProperties', 'getAncestors'],
});

export { ActiveSupport$Impl };
