import { RueModule, ActiveSupport$ImplBase } from '@rue/activesupport';

// modles
import { ActiveRecord$Scoping$Named } from './named';
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';

export class ActiveRecord$Scoping$Impl extends RueModule {
  static __rue_impl_class__ = ActiveSupport$ImplBase.__rue_impl_class__;
  // ActiveRecord$Scoping$Named
  static all: <T extends ActiveRecord$Base>() => Promise<ActiveRecord$Relation<T>>;
}

ActiveRecord$Scoping$Named.rueModuleExtendedFrom(ActiveRecord$Scoping$Impl, { only: ['all'] });
