// functions
import { rueModuleExtend } from '@/modules';

// modules
import { InfoModule } from './modules';

// types
import * as mit from './modules/info';

class Impl {
  static getMethods: (obj?: Function) => string[];
  static getMethodsWithNamespace: (obj?: Function) => mit.Info$MethodWithNamespace;
  static getProperties: (obj?: Function) => string[];
}

interface Impl {}

// module extend
rueModuleExtend(Impl, InfoModule, {
  only: ['getMethods', 'getMethodsWithNamespace', 'getProperties'],
});

export { Impl };
