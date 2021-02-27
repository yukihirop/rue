export type PrimaryKey = string | number;
export type ForeignKey = string | number;
export type IntermediateTable = Array<[ForeignKey, ForeignKey]>;
export type BelongsTo<T> = () => Promise<T>;
export type HasOne<T> = () => Promise<T>;
export type HasMany<T> = () => Promise<T[]>;
export type HasAndBelongsToMany<T> = () => Promise<T[]>;

// from modules
export type { CollectionProxy$Scope } from './modules';
