// rue packages
import { ActiveSupport$ImplBase } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';
import { ActiveRecord$Associations$CollectionProxy$Holder } from './holder';

/**
 * @see https://gist.github.com/domenic/8ed6048b187ee8f2ec75
 * @see https://gist.github.com/oliverfoster/00897f4552cef64653ef14d8b26338a6
 * @see https://github.com/microsoft/TypeScript/issues/12661
 * @todo Reconsider Promise type
 */
abstract class ActiveRecord$Associations$CollectionProxy$Impl<
  T extends ActiveRecord$Base
> extends ActiveRecord$Relation<
  T,
  ActiveRecord$Associations$CollectionProxy$Holder<T>,
  ActiveRecord$Relation<T>
> {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = ActiveSupport$ImplBase.__rue_impl_class__;
}

interface ActiveRecord$Associations$CollectionProxy$Impl<T extends ActiveRecord$Base> {}

export { ActiveRecord$Associations$CollectionProxy$Impl };
