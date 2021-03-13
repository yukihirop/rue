import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';

export type ScopeVal<T extends ActiveRecord$Base> = ActiveRecord$Relation<T>;
export type ScopeFn<T extends ActiveRecord$Base> = (...args) => ScopeVal<T>;
export type Scope<T extends ActiveRecord$Base> = (...args) => ActiveRecord$Relation<T>;
