// modules
import { InfoModule } from './modules';

// types
import * as mit from './modules/info';

export abstract class ActiveSupport$ImplBase {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = true;
}

abstract class ActiveSupport$Impl extends ActiveSupport$ImplBase {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = ActiveSupport$ImplBase.__rue_impl_class__;
  static __rue_ancestors__ = [];

  static getMethodsWithNamespace: (obj?: Function | object) => mit.Info$MethodWithNamespace;
  static getProperties: (obj?: Function) => string[];
  static getAncestors: <T = string>(
    obj?: Function | object,
    transformer?: (obj: Function) => T
  ) => T[];
}

interface ActiveSupport$Impl {}

// module extend
InfoModule.rueModuleExtendedFrom(ActiveSupport$Impl, {
  only: ['getMethodsWithNamespace', 'getProperties', 'getAncestors'],
});

export { ActiveSupport$Impl };
