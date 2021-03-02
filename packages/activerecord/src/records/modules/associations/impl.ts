// rue packages
import { RueModule, ActiveSupport$ImplBase } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Associations$CollectionProxy } from './modules';

// types
import * as mcpt from './modules/collection_proxy';

abstract class ActiveRecord$Associations$Impl extends RueModule {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = ActiveSupport$ImplBase.__rue_impl_class__;
  // ActiveRecord$Associations$CollectionProxy
  static scope: <T extends ActiveRecord$Base>(
    scopeName: string,
    fn: mcpt.CollectionProxy$ScopeFn<T>
  ) => void;
}

interface ActiveRecord$Associations$Impl {}

// module extend
ActiveRecord$Associations$CollectionProxy.rueModuleExtendedFrom(ActiveRecord$Associations$Impl, {
  only: ['scope'],
});

export { ActiveRecord$Associations$Impl };
