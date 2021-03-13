// locals
import { ActiveRecord$Base } from '@/records/base';
import { ActiveRecord$Associations$CollectionProxy$Impl } from './impl';

export class ActiveRecord$Associations$CollectionProxy<
  T extends ActiveRecord$Base
> extends ActiveRecord$Associations$CollectionProxy$Impl<T> {}
