import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Associations$CollectionProxy$Holder } from './collection_proxy';
import { ActiveRecord$Associations$Holder } from './holder';

// types
import type * as t from '@/index';

// Instance Variables type
export type AssociationCache = {
  [relationName: string]: {
    associationHolder?:
      | ActiveRecord$Associations$CollectionProxy$Holder<ActiveRecord$Base>
      | ActiveRecord$Associations$Holder<ActiveRecord$Base>;
    associationScope?: Promise<ActiveRecord$Base[]> | ActiveRecord$Base[];
  };
};

type HolderHasManyData = {
  dependent?: boolean;
  validate?: boolean;
  foreignKeyData: { [key: string]: t.Record$ForeignKey };
};
export type HolderAssociationData = HolderHasManyData;
