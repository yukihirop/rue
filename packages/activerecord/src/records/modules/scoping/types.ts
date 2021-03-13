import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';

// types
import type * as ct from '@/types';

export type ScopeVal<T extends ActiveRecord$Base> = ActiveRecord$Relation<T>;
export type ScopeFn<T extends ActiveRecord$Base> = (
  self: ct.Constructor<T>,
  ...args
) => ScopeVal<T>;
export type Scope<T extends ActiveRecord$Base> = (
  self: ct.Constructor<T>,
  ...args
) => ActiveRecord$Relation<T>;
