// rue packages
import { Model } from '@rue/activemodel';
import { Support$ImplBase } from '@rue/activesupport';

// locals
import { Record } from '@/records';
import { CollectionProxyModule } from './modules';

// types
import * as mt from './modules';

abstract class ActiveRecord$Associations$Impl extends Model {
  // Prepared for checking with hasOwnProperty ()
  static __rue_abstract_class__ = Support$ImplBase.__rue_abstract_class__;

  // CollectionProxyModule
  static scope: <T extends Record>(scopeName: string, fn: mt.CollectionProxy$ScopeFn<T>) => void;
}

interface ActiveRecord$Associations$Impl {}

CollectionProxyModule.rueModuleExtendedFrom(ActiveRecord$Associations$Impl, { only: ['scope'] });

export { ActiveRecord$Associations$Impl };
