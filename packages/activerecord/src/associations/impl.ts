// rue packages
import { Model } from '@rue/activemodel';

// locals
import { Record } from '@/records';
import { CollectionProxyModule } from './modules';
import { moduleExtend } from '@/utils';

// types
import * as mt from './modules';

class Impl extends Model {
  // CollectionProxyModule
  static scope: <T extends Record>(scopeName: string, fn: mt.CollectionProxy$ScopeFn<T>) => void;
}

interface Impl {}

moduleExtend(Impl, CollectionProxyModule, { only: ['scope'] });

export { Impl };
