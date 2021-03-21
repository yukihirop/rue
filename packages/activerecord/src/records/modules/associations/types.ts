import { ActiveRecord$Associations$CollectionProxy } from '@/records/associations';
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';

// types
import type * as ct from '@/types';

/**
 * @todo Use runtime ActiveRecord$Associations$CollectionProxy instead of ActiveRecord$Relation
 */
export type PrimaryKey = string | number;
export type ForeignKey = string | number;
export type BelongsTo<T extends ActiveRecord$Base> = () => Promise<T>;
export type HasOne<T extends ActiveRecord$Base> = () => Promise<T>;
export type HasMany<
  T extends ActiveRecord$Base
> = () => ActiveRecord$Associations$CollectionProxy<T>;

export const enum AssociationList {
  belongsTo = 'belongsTo',
  hasOne = 'hasOne',
  hasMany = 'hasMany',
}

/**
 * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#method-i-has_many
 */
export const enum DependentList {
  destroy = 'destroy',
  delete = 'delete',
  deleteAll = 'deleteAll',
  nullify = 'nullify',
  restrictWithException = 'restrictWithException',
  restrictWithError = 'restrictWithError',
}

export type ThroughOptions<T extends ActiveRecord$Base> = {
  klass: ct.Constructor<T>;
  foreignKey: ForeignKey;
  associationForeignKey?: ForeignKey;
};

export type HasManyScope<T extends ActiveRecord$Base> = (
  self: ct.Constructor<T>
) => ActiveRecord$Associations$CollectionProxy<T>;

export type HasOneScope<T extends ActiveRecord$Base> = (
  self: ct.Constructor<T>
) => ActiveRecord$Relation<T>;

/**
 * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#method-i-has_one
 */
export type HasOneOptions<T extends ActiveRecord$Base, U extends ActiveRecord$Base = any> = {
  klass: ct.Constructor<T>;
  foreignKey: ForeignKey;
  dependent?: ct.valueOf<DependentList>;
  validate?: boolean;
  through?: ThroughOptions<U>;
  autosave?: boolean;
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
  through?: ThroughOptions<U>;
  autosave?: boolean;
};
