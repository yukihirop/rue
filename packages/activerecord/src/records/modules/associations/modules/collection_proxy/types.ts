import { Filter$WhereChain } from '@/filters';

export type ScopeVal<T> = Promise<T[]> | Filter$WhereChain;
export type ScopeFn<T> = (...args) => ScopeVal<T>;
export type Scope<T> = (...args) => Promise<T[]>;
