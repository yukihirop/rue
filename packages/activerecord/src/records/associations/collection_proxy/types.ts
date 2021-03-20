import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';
import { ActiveRecord$Associations$CollectionProxy$Holder } from './holder';

// types
import type * as t from '@/index';

export type ScopeVal<T extends ActiveRecord$Base> = ActiveRecord$Relation<T>;
export type ScopeFn<T extends ActiveRecord$Base> = (...args) => ScopeVal<T>;
export type Scope<T extends ActiveRecord$Base> = (...args) => ActiveRecord$Relation<T>;

type HolderHasManyData = {
  dependent?: boolean;
  validate?: boolean;
  foreignKeyData: { [key: string]: t.Record$ForeignKey };
};
export type HolderAssociationData = HolderHasManyData;

// Instance Variables type
export type AssociationCache = {
  [relationName: string]: {
    associationHolder?: ActiveRecord$Associations$CollectionProxy$Holder<ActiveRecord$Base>;
    associationScope?: Promise<ActiveRecord$Base[]> | ActiveRecord$Base[];
  };
};
