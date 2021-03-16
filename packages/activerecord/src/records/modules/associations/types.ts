import { ActiveRecord$Relation } from '@/records/relations';
import { ActiveRecord$Associations$CollectionProxy } from '@/records/associations';
import { ActiveRecord$Base } from '@/records';

// types
import type * as ct from '@/types';

/**
 * @todo Use runtime ActiveRecord$Associations$CollectionProxy instead of ActiveRecord$Relation
 */
export type PrimaryKey = string | number;
export type ForeignKey = string | number;
export type IntermediateTable = Array<[ForeignKey, ForeignKey]>;
export type BelongsTo<T extends ActiveRecord$Base> = () => Promise<T>;
export type HasOne<T extends ActiveRecord$Base> = () => Promise<T>;
export type HasMany<
  T extends ActiveRecord$Base
> = () => ActiveRecord$Associations$CollectionProxy<T>;
export type HasAndBelongsToMany<T extends ActiveRecord$Base> = () => ActiveRecord$Relation<T>;
export type AssociationList = 'belongsTo' | 'hasOne' | 'hasMany' | 'hasAndBelongsToManny';

/**
 * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#method-i-has_many
 */
export type HasManyOptions<T extends ActiveRecord$Base> = {
  klass: ct.Constructor<T>;
  foreignKey: ForeignKey;
  dependent?: 'destroy' | 'deleteAll' | 'nullify' | 'restrictWithException' | 'restrictWithError';
  validate?: boolean;
};
/**
 * @todo remove ? from foreignKey, associationKlass, associationForeignKey
 */
export type HasAndBelongsToManyOptions<T extends ActiveRecord$Base> = {
  klass: ct.Constructor<T>;
  foreignKey?: ForeignKey;
  associationKlass?: ct.Constructor<T>;
  associationForeignKey?: ForeignKey;
  validate?: boolean;
};

export type HasManyScope<T extends ActiveRecord$Base> = (
  self: ct.Constructor<T>
) => ActiveRecord$Relation<T>;
export type HasAndBelongsToManyScope<T extends ActiveRecord$Base> = HasManyScope<T>;
