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

export const enum AssociationList {
  belongsTo = 'belongsTo',
  hasOne = 'hasOne',
  hasMany = 'hasMany',
  hasAndBelongsToMany = 'hasAndBelongsToMany',
}

/**
 * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#method-i-has_many
 */
export const enum DependentList {
  destroy = 'destroy',
  deleteAll = 'deleteAll',
  nullify = 'nullify',
  restrictWithException = 'restrictWithException',
  restrictWithError = 'restrictWithError',
}

export type HasManyThroughOptions<T extends ActiveRecord$Base> = {
  klass: ct.Constructor<T>;
  foreignKey: ForeignKey;
  associationForeignKey?: ForeignKey;
};

/**
 * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#method-i-has_many
 * @description If you specify `through`, the `foreignKey` option and `scope` is ignored.
 */
export type HasManyOptions<T extends ActiveRecord$Base, U extends ActiveRecord$Base = any> = {
  klass: ct.Constructor<T>;
  foreignKey: ForeignKey;
  dependent?: ct.valueOf<DependentList>;
  validate?: boolean;
  through?: HasManyThroughOptions<U>;
  autosave?: boolean;
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
