import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$QueryMethods$WhereChain } from '@/records/relations/modules/query_methods';

export type ScopeVal<T extends ActiveRecord$Base> =
  | Promise<T[]>
  | ActiveRecord$QueryMethods$WhereChain<T>;
export type ScopeFn<T extends ActiveRecord$Base> = (...args) => ScopeVal<T>;
export type Scope<T extends ActiveRecord$Base> = (...args) => Promise<T[]>;
