// rue packages
import { RueModule, ActiveSupport$ImplBase } from '@ruejs/activesupport';

abstract class ActiveRecord$Associations$Impl extends RueModule {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = ActiveSupport$ImplBase.__rue_impl_class__;
}

interface ActiveRecord$Associations$Impl {}

export { ActiveRecord$Associations$Impl };
