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
export const DependentList = {
  destroy: 'destroy',
  delete: 'delete',
  deleteAll: 'deleteAll',
  nullify: 'nullify',
  restrictWithException: 'restrictWithException',
  restrictWithError: 'restrictWithError',
};

export type ThroughOptions<T extends ActiveRecord$Base> = {
  klass: ct.Constructor<T>;
  foreignKey: string;
  associationForeignKey?: string;
};

export type BelongsToScope<T extends ActiveRecord$Base> = (
  self: ct.Constructor<T>
) => ActiveRecord$Relation<T>;

export type HasOneScope<T extends ActiveRecord$Base> = (
  self: ct.Constructor<T>
) => ActiveRecord$Relation<T>;

export type HasManyScope<T extends ActiveRecord$Base> = (
  self: ct.Constructor<T>
) => ActiveRecord$Associations$CollectionProxy<T>;

/**
 * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#method-i-belongs_to
 */
export type BelongsToOptions<T extends ActiveRecord$Base> = {
  klass: ct.Constructor<T>;
  foreignKey: string;
  dependent?: 'delete' | 'destroy';
  validate?: boolean;
  autosave?: boolean;
};

/**
 * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html#method-i-has_one
 */
export type HasOneOptions<T extends ActiveRecord$Base, U extends ActiveRecord$Base = any> = {
  klass: ct.Constructor<T>;
  foreignKey: string;
  dependent?: typeof DependentList[keyof typeof DependentList];
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
  foreignKey: string;
  dependent?: typeof DependentList[keyof typeof DependentList];
  validate?: boolean;
  through?: ThroughOptions<U>;
  autosave?: boolean;
};
