import { ActiveRecord$Relation } from '@/records/relations';

/**
 * @todo Use runtime ActiveRecord$Associations$CollectionProxy instead of ActiveRecord$Relation
 */
export type PrimaryKey = string | number;
export type ForeignKey = string | number;
export type IntermediateTable = Array<[ForeignKey, ForeignKey]>;
export type BelongsTo<T> = () => Promise<T>;
export type HasOne<T> = () => Promise<T>;
// @ts-expect-error
export type HasMany<T> = () => Promise<ActiveRecord$Relation<T>>;
// @ts-expect-error
export type HasAndBelongsToMany<T> = () => Promise<ActiveRecord$Relation<T>>;

// from modules
export type { CollectionProxy$Scope } from './modules';
