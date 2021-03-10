// rue packages
import { ActiveSupport$ImplBase as Support$ImplBase } from '@rue/activesupport';
import { ActiveModel$Base } from '@rue/activemodel';

// local
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';
import {
  ActiveRecord$Persistence,
  ActiveRecord$Associations,
  ActiveRecord$Scoping,
  ActiveRecord$Querying,
  ActiveRecord$Core,
} from '@/records/modules';

// types
import * as at from '@/records/modules/associations';
import * as acpt from '@/records/modules/associations/modules/collection_proxy';
import * as rmt from '@/records/relations/modules';

// https://stackoverflow.com/questions/42999765/add-a-method-to-an-existing-class-in-typescript/43000000#43000000
abstract class ActiveRecord$Impl extends ActiveModel$Base {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = Support$ImplBase.__rue_impl_class__;

  // Instance vairalbes
  protected _destroyed: boolean;
  protected _newRecord: boolean;

  // ActiveRecord$Persistence
  static RUE_RECORD_ID = ActiveRecord$Persistence.RUE_RECORD_ID;
  static RUE_CREATED_AT = ActiveRecord$Persistence.RUE_CREATED_AT;
  static RUE_UPDATED_AT = ActiveRecord$Persistence.RUE_UPDATED_AT;
  static RECORD_ALL = ActiveRecord$Persistence.RECORD_ALL;
  static RUE_AUTO_INCREMENT_RECORD_ID = ActiveRecord$Persistence.RUE_AUTO_INCREMENT_RECORD_ID;
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
  // ActiveRecord$Core
  static find: <T extends ActiveRecord$Base>(
    ...primaryKeys: at.Associations$PrimaryKey[]
  ) => T | T[];
  // ActiveRecord$Querying
  // static find: <T extends ActiveRecord$Base, U = { [key: string]: any }>(
  //   ...primaryKeys: at.Associations$PrimaryKey[]
  // ) => Promise<T | T[]>;
  static findBy: <T extends ActiveRecord$Base, U>(params: Partial<U>) => Promise<T>;
  static findByOrThrow: <T extends ActiveRecord$Base, U>(params: Partial<U>) => Promise<T>;
  static take: <T extends ActiveRecord$Base>(limit?: number) => Promise<T | T[]>;
  static takeOrThrow: <T extends ActiveRecord$Base>(limit?: number) => Promise<T | T[]>;
  static first: <T extends ActiveRecord$Base>(limit?: number) => Promise<T | T[]>;
  static firstOrThrow: <T extends ActiveRecord$Base>(limit?: number) => Promise<T | T[]>;
  static last: <T extends ActiveRecord$Base>(limit?: number) => Promise<T | T[]>;
  static lastOrThrow: <T extends ActiveRecord$Base>(limit?: number) => Promise<T | T[]>;
  static isExists: <T extends ActiveRecord$Base, U>(
    condition?: rmt.FinderMethods$ExistsCondition<U>
  ) => Promise<boolean>;
  static isAny: <T extends ActiveRecord$Base>(filter?: (record: T) => boolean) => Promise<boolean>;
  static isMany: <T extends ActiveRecord$Base>(filter?: (record: T) => boolean) => Promise<boolean>;
  static isNone: <T extends ActiveRecord$Base>(filter?: (record: T) => boolean) => Promise<boolean>;
  static isOne: <T extends ActiveRecord$Base>(filter?: (record: T) => boolean) => Promise<boolean>;
  static findOrCreateBy: <T extends ActiveRecord$Base, U>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ) => Promise<T>;
  static findOrCreateByOrThrow: <T extends ActiveRecord$Base, U>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ) => Promise<T>;
  static findOrInitializeBy: <T extends ActiveRecord$Base, U>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ) => Promise<T>;
  static createOrFindBy: <T extends ActiveRecord$Base, U>(params: Partial<U>) => Promise<T>;
  static createOrFindByOrThrow: <T extends ActiveRecord$Base, U>(params: Partial<U>) => Promise<T>;
  static destroyAll: <T extends ActiveRecord$Base>() => Promise<T[]>;
  static deleteAll: <T extends ActiveRecord$Base>() => Promise<number>;
  static updateAll: <T extends ActiveRecord$Base, U>(params: Partial<U>) => Promise<number>;
  static touchAll: <T extends ActiveRecord$Base, U>(
    params?: Partial<U>,
    opts?: { withCreatedAt?: boolean; time?: string }
  ) => Promise<number>;
  static destroyBy: <T extends ActiveRecord$Base>(filter?: (self: T) => boolean) => Promise<T[]>;
  static deleteBy: <T extends ActiveRecord$Base, U>(params?: Partial<U>) => Promise<number>;
  static where: <T extends ActiveRecord$Base, U>(
    params: Partial<U>
  ) => Promise<ActiveRecord$Relation<T>>;
  static rewhere: <T extends ActiveRecord$Base, U>(
    params: Partial<U>
  ) => Promise<ActiveRecord$Relation<T>>;
  static order: <T extends ActiveRecord$Base, U = { [key: string]: rmt.QueryMethods$Directions }>(
    params: Partial<U>
  ) => Promise<ActiveRecord$Relation<T>>;
  static reorder: <T extends ActiveRecord$Base, U = { [key: string]: rmt.QueryMethods$Directions }>(
    params: Partial<U>
  ) => Promise<ActiveRecord$Relation<T>>;
  static offset: <T extends ActiveRecord$Base>(value: number) => Promise<ActiveRecord$Relation<T>>;
  static limit: <T extends ActiveRecord$Base>(value: number) => Promise<ActiveRecord$Relation<T>>;
  static group: <T extends ActiveRecord$Base, U = { [key: string]: any }>(
    ...props: Array<keyof U>
  ) => Promise<ActiveRecord$Relation<T>>;
  static unscope: <T extends ActiveRecord$Base>(
    ...scopeMethods: rmt.QueryMethods$ScopeMethods[]
  ) => Promise<ActiveRecord$Relation<T>>;
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
ActiveRecord$Persistence.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: [
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
ActiveRecord$Associations.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: ['belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany', 'scope'],
});

ActiveRecord$Core.rueModuleExtendedFrom(ActiveRecord$Impl, { only: ['find'] });
ActiveRecord$Scoping.rueModuleExtendedFrom(ActiveRecord$Impl, { only: ['all'] });
ActiveRecord$Querying.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: [
    /**
     * delegate to ActiveRecord$FinderMethods
     */
    // 'find',  Give priority to find in ActiveRecord$Core
    'findBy',
    'findByOrThrow',
    'take',
    'takeOrThrow',
    'first',
    'firstOrThrow',
    'last',
    'lastOrThrow',
    'isExists',
    /**
     * delegate to ActiveRecord$Relation
     */
    'isAny',
    'isMany',
    'isNone',
    'isOne',
    'findOrCreateBy',
    'findOrCreateByOrThrow',
    'findOrCreate',
    'findOrCreateOrThrow',
    'findOrInitializeBy',
    'createOrFindBy',
    'createOrFindByOrThrow',
    'destroyAll',
    'deleteAll',
    'updateAll',
    'touchAll',
    'destroyBy',
    'deleteBy',
    /**
     * delegate to ActiveRecord$QueryMethods
     */
    'where',
    'rewhere',
    'order',
    'reorder',
    'offset',
    'limit',
    'group',
    'unscope',
  ],
});

export { ActiveRecord$Impl };
