import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';
import { ActiveRecord$Associations$CollectionProxy$Holder } from '../collection_proxy';

export class ActiveRecord$Associations$Relation$Base<
  T extends ActiveRecord$Base,
  H extends ActiveRecord$Associations$CollectionProxy$Holder<T>,
  S = T[] | Promise<T>
> extends ActiveRecord$Relation<T, H, S> {}
