import { ActiveRecord$QueryMethods$WhereChain } from '@/records/modules/query_methods';

export type ScopeVal<T> = Promise<T[]> | ActiveRecord$QueryMethods$WhereChain;
export type ScopeFn<T> = (...args) => ScopeVal<T>;
export type Scope<T> = (...args) => Promise<T[]>;
