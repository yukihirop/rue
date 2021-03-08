// rue packages
import { ActiveSupport$ImplBase as Support$ImplBase } from '@rue/activesupport';
import { ActiveModel$Base } from '@rue/activemodel';

// local
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';
import { ActiveRecord$QueryMethods$WhereChain } from '@/records/modules/query_methods';
import {
  ActiveRecord$Persistence,
  ActiveRecord$FinderMethods,
  ActiveRecord$Associations,
  ActiveRecord$Scoping,
  ActiveRecord$QueryMethods,
  ActiveRecord$Core,
} from '@/records/modules';

// types
import * as at from '@/records/modules/associations';
import * as acpt from '@/records/modules/associations/modules/collection_proxy';
import * as qmt from '@/records/modules/query_methods';

// https://stackoverflow.com/questions/42999765/add-a-method-to-an-existing-class-in-typescript/43000000#43000000
abstract class ActiveRecord$Impl extends ActiveModel$Base {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = Support$ImplBase.__rue_impl_class__;
  static __rue_ancestors__ = [];

  // Instance vairalbes
  protected _destroyed: boolean;
  protected _newRecord: boolean;

  // ActiveRecord$Persistence
  static RUE_RECORD_ID = ActiveRecord$Persistence.RUE_RECORD_ID;
  static RUE_CREATED_AT = ActiveRecord$Persistence.RUE_CREATED_AT;
  static RUE_UPDATED_AT = ActiveRecord$Persistence.RUE_UPDATED_AT;
  static RECORD_ALL = ActiveRecord$Persistence.RECORD_ALL;
  static RUE_AUTO_INCREMENT_RECORD_ID = ActiveRecord$Persistence.RUE_AUTO_INCREMENT_RECORD_ID;
  static destroyAll: <T extends ActiveRecord$Base>(filter?: (self: T) => boolean) => T[];
  static create: <T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ) => T | T[];
  static createOrThrow: <T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ) => T | T[];
  static delete: (primaryKey: at.Associations$PrimaryKey | at.Associations$PrimaryKey[]) => number;
  static destroy: <T extends ActiveRecord$Base>(
    primaryKey: at.Associations$PrimaryKey | at.Associations$PrimaryKey[]
  ) => T | T[];
  static update: <T extends ActiveRecord$Base, U>(
    primaryKey: at.Associations$PrimaryKey | at.Associations$PrimaryKey[] | 'all',
    params: Partial<U> | Array<Partial<U>>
  ) => T | T[];
  // ActiveRecord$FinderMethods
  static findBy: <T extends ActiveRecord$Base, U>(params: Partial<U>) => Promise<T>;
  // ActiveRecord$Associations
  static belongsTo: <T extends ActiveRecord$Base = any>(
    relationName: string,
    klass: Function,
    foreignKey: string
  ) => void;
  static hasOne: <T extends ActiveRecord$Base = any>(
    relationName: string,
    klass: Function,
    foreignKey: at.Associations$ForeignKey
  ) => void;
  static hasMany: <T extends ActiveRecord$Base = any>(
    relationName: string,
    klass: Function,
    foreignKey: at.Associations$ForeignKey
  ) => void;
  static hasAndBelongsToMany: <T extends ActiveRecord$Base = any>(
    relationName,
    klass: Function
  ) => void;
  static scope: <T extends ActiveRecord$Base>(
    scopeName: string,
    fn: acpt.CollectionProxy$ScopeFn<T>
  ) => void;
  protected static defineAssociations<T extends ActiveRecord$Base>(self: T) {
    ActiveRecord$Associations._defineAssociations(self);
  }
  // ActiveRecord$Scoping
  static all: <T extends ActiveRecord$Base>() => Promise<ActiveRecord$Relation<T>>;
  // ActiveRecord$QueryMethods
  static where: <T extends ActiveRecord$Base, U = qmt.QueryMethods$WhereParams>(
    params: Partial<U>
  ) => ActiveRecord$QueryMethods$WhereChain<T>;
  static rewhere: <T extends ActiveRecord$Base, U = qmt.QueryMethods$WhereParams>(
    params: Partial<U>
  ) => ActiveRecord$QueryMethods$WhereChain<T>;
  // ActiveRecord$Core
  static find: <T extends ActiveRecord$Base>(
    ...primaryKeys: at.Associations$PrimaryKey[]
  ) => T | T[];
}

interface ActiveRecord$Impl {
  // ActiveRecord$Persistence
  isNewRecord(): boolean;
  isPersisted(): boolean;
  save(opts?: { validate: boolean }): boolean;
  saveOrThrow(): void | boolean;
  destroy<T extends ActiveRecord$Base>(): T;
  isDestroyed(): boolean;
  touch(opts?: { withCreatedAt?: boolean; time?: string }): boolean;
  update<T>(params?: Partial<T>): boolean;
  updateOrThrow<T>(params?: Partial<T>): boolean;
  updateAttribute<T extends ActiveRecord$Base>(name: string, value: any): boolean;
  /**
   * @alias updateAttribute
   */
  updateProperty<T extends ActiveRecord$Base>(name: string, value: any): boolean;
  /**
   * @alias updateAttribute
   */
  updateProp<T extends ActiveRecord$Base>(name: string, value: any): boolean;
  // ActiveRecord$Associations
  primaryKey: at.Associations$PrimaryKey;
  hasAndBelongsToMany<T extends ActiveRecord$Associations = any>(
    record: T
  ): { [key: string]: at.Associations$ForeignKey };
  releaseAndBelongsToMany<T extends ActiveRecord$Associations = any>(
    record: T
  ): { [key: string]: at.Associations$ForeignKey };
}

// includes module
ActiveRecord$Persistence.rueModuleIncludedFrom(ActiveRecord$Impl, {
  only: [
    'isNewRecord',
    'isPersisted',
    'save',
    'saveOrThrow',
    'destroy',
    'isDestroyed',
    'touch',
    'update',
    'updateOrThrow',
    'updateAttribute',
    'updateProperty',
    'updateProp',
  ],
});
ActiveRecord$Associations.rueModuleIncludedFrom(ActiveRecord$Impl, {
  only: ['hasAndBelongsToMany', 'releaseAndBelongsToMany'],
});

// extend module
ActiveRecord$Core.rueModuleExtendedFrom(ActiveRecord$Impl, { only: ['find'] });
ActiveRecord$Persistence.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: [
    'destroyAll',
    'create',
    'createOrThrow',
    'delete',
    'destroy',
    'update',
    'RUE_AUTO_INCREMENT_RECORD_ID',
    'RUE_RECORD_ID',
    'RECORD_ALL',
  ],
});
ActiveRecord$FinderMethods.rueModuleExtendedFrom(ActiveRecord$Impl, { only: ['findBy'] });
ActiveRecord$Associations.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: ['belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany', 'scope'],
});
ActiveRecord$Scoping.rueModuleExtendedFrom(ActiveRecord$Impl, { only: ['all'] });
ActiveRecord$QueryMethods.rueModuleExtendedFrom(ActiveRecord$Impl, { only: ['where', 'rewhere'] });

export { ActiveRecord$Impl };
