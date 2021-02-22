// functions
import { rueModuleExtend } from '@/modules';

// modules
import { InfoModule } from './modules';

// types
import * as mt from '@/modules';
import * as mit from './modules/info';

class ActiveSupport$Impl {
  static getMethods: (obj?: Function) => string[];
  static getMethodsWithNamespace: (obj?: Function) => mit.Info$MethodWithNamespace;
  static getProperties: (obj?: Function) => string[];
  static getAncestors: (func?: Function) => mt.RueAncestor[];
}

interface ActiveSupport$Impl {}

// module extend
rueModuleExtend(ActiveSupport$Impl, InfoModule, {
  only: ['getMethods', 'getMethodsWithNamespace', 'getProperties', 'getAncestors'],
});

export { ActiveSupport$Impl };
