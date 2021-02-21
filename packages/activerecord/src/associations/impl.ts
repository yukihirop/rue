// rue packages
import { Model } from '@rue/activemodel';
import { Support } from '@rue/activesupport';

// locals
import { Record } from '@/records';
import { CollectionProxyModule } from './modules';

// types
import * as mt from './modules';

class Impl extends Model {
  // CollectionProxyModule
  static scope: <T extends Record>(scopeName: string, fn: mt.CollectionProxy$ScopeFn<T>) => void;
}

interface Impl {}

Support.rueModuleExtend(Impl, CollectionProxyModule, { only: ['scope'] });

export { Impl };
