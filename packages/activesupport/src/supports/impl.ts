// functions
import { rueModuleExtend } from '@/modules';

// modules
import { InfoModule } from './modules';

// types
import * as mit from './modules/info';

class ActiveSupport$Impl {
  static getMethods: (obj?: Function) => string[];
  static getMethodsWithNamespace: (obj?: Function) => mit.Info$MethodWithNamespace;
  static getProperties: (obj?: Function) => string[];
}

interface ActiveSupport$Impl {}

// module extend
rueModuleExtend(ActiveSupport$Impl, InfoModule, {
  only: ['getMethods', 'getMethodsWithNamespace', 'getProperties'],
});

export { ActiveSupport$Impl };
