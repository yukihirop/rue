// rue packages
import { Model } from '@rue/activemodel';

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

Impl.moduleExtend(CollectionProxyModule, { only: ['scope'] });

export { Impl };
