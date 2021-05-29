// rue packages
import { ActiveSupport$ImplBase as Support$ImplBase } from '@ruejs/activesupport';
import { ActiveModel$Base } from '@ruejs/activemodel';

// local
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';
import {
  ActiveRecord$Persistence,
  ActiveRecord$Associations,
  ActiveRecord$Associations$Persistence,
  ActiveRecord$Scoping,
  ActiveRecord$Querying,
  ActiveRecord$Core,
  ActiveRecord$AttributeMethods,
  ActiveRecord$Dirty,
  ActiveRecord$Meta,
} from '@/records/modules';

// types
import type * as t from './types';
import type * as mt from '@/records/modules';
import type * as mat from '@/records/modules/associations';
import type * as rmt from '@/records/relations/modules';
import type * as rat from '@/records/associations/types';

// https://stackoverflow.com/questions/42999765/add-a-method-to-an-existing-class-in-typescript/43000000#43000000
abstract class ActiveRecord$Impl<P extends t.Params = t.Params> extends ActiveModel$Base {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = Support$ImplBase.__rue_impl_class__;

  // Instance vairalbes
  public id: mat.Associations$PrimaryKey;
  public errors: t.Validations$Errors;
  protected _destroyed: boolean;
  protected _newRecord: boolean;
  _associationCache: rat.AssociationCache;

  // ActiveRecord$Persistence
  static RUE_RECORD_ID = ActiveRecord$Persistence.RUE_RECORD_ID;
  static RUE_CREATED_AT = ActiveRecord$Persistence.RUE_CREATED_AT;
  static RUE_UPDATED_AT = ActiveRecord$Persistence.RUE_UPDATED_AT;
  static RECORD_ALL = ActiveRecord$Persistence.RECORD_ALL;
  static RECORD_META = ActiveRecord$Persistence.RECORD_META;
  static RUE_AUTO_INCREMENT_RECORD_ID = ActiveRecord$Persistence.RUE_AUTO_INCREMENT_RECORD_ID;
  protected static createSync: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ) => T | T[];
  protected static createSyncOrThrow: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ) => T | T[];
  protected static deleteSync: (
    id: mat.Associations$PrimaryKey | mat.Associations$PrimaryKey[]
  ) => number;
  protected static destroySync: <T extends ActiveRecord$Base<t.Params>>(
    id: mat.Associations$PrimaryKey | mat.Associations$PrimaryKey[]
  ) => T | T[];
  protected static updateSync: <T extends ActiveRecord$Base, U>(
    id: mat.Associations$PrimaryKey | mat.Associations$PrimaryKey[] | 'all',
    params: Partial<U> | Array<Partial<U>>
  ) => T | T[];

  /**
   * Please override to hit the external API.
   */
  static create: <T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ) => Promise<T | T[]>;
  static createOrThrow: <T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ) => Promise<T | T[]>;
  static delete: <T extends ActiveRecord$Base>(
    id: mat.Associations$PrimaryKey | mat.Associations$PrimaryKey[]
  ) => Promise<number>;
  static destroy: <T extends ActiveRecord$Base>(
    id: mat.Associations$PrimaryKey | mat.Associations$PrimaryKey[]
  ) => Promise<T | T[]>;
  static update: <T extends ActiveRecord$Base, U>(
    id: mat.Associations$PrimaryKey | mat.Associations$PrimaryKey[] | 'all',
    params: Partial<U> | Array<Partial<U>>
  ) => Promise<T | T[]>;

  // ActiveRecord$Associations
  static belongsTo: <T extends ActiveRecord$Base>(
    relationName: string,
    opts: mat.Associations$BelongsToOptions<T>,
    scope?: mat.Associations$BelongsToScope<T>
  ) => void;
  static hasOne: <T extends ActiveRecord$Base, U extends ActiveRecord$Base = any>(
    relationName: string,
    opts: mat.Associations$HasOneOptions<T, U>,
    scope?: mat.Associations$HasOneScope<T>
  ) => void;
  static hasMany: <T extends ActiveRecord$Base, U extends ActiveRecord$Base = any>(
    relationName: string,
    opts: mat.Associations$HasManyOptions<T, U>,
    scope?: mat.Associations$HasManyScope<T>
  ) => void;
  protected static defineAssociations<T extends ActiveRecord$Base>(self: T) {
    ActiveRecord$Associations._defineAssociations(self);
  }
  // ActiveRecord$Scoping
  static all: <T extends ActiveRecord$Base<t.Params>>() => ActiveRecord$Relation<T>;
  static scope: <T extends ActiveRecord$Base>(
    scopeName: string,
    fn: (self: typeof ActiveRecord$Base, ...args: any[]) => mt.Scoping$ScopeVal<T>
  ) => void;
  // ActiveRecord$Core
  static find: <T extends ActiveRecord$Base<t.Params>>(
    ...ids: mat.Associations$PrimaryKey[]
  ) => T | T[];
  // ActiveRecord$Querying
  // static find: <T extends ActiveRecord$Base, U = { [key: string]: any }>(
  //   ...ids: mat.Associations$PrimaryKey[]
  // ) => Promise<T | T[]>;
  static findBy: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params: Partial<U>
  ) => Promise<T>;
  static findByOrThrow: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params: Partial<U>
  ) => Promise<T>;
  static take: <T extends ActiveRecord$Base<t.Params>>(limit?: number) => Promise<T | T[]>;
  static takeOrThrow: <T extends ActiveRecord$Base<t.Params>>(limit?: number) => Promise<T | T[]>;
  static first: <T extends ActiveRecord$Base<t.Params>>(limit?: number) => Promise<T | T[]>;
  static firstOrThrow: <T extends ActiveRecord$Base<t.Params>>(limit?: number) => Promise<T | T[]>;
  static last: <T extends ActiveRecord$Base<t.Params>>(limit?: number) => Promise<T | T[]>;
  static lastOrThrow: <T extends ActiveRecord$Base<t.Params>>(limit?: number) => Promise<T | T[]>;
  static isExists: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    condition?: rmt.FinderMethods$ExistsCondition<U>
  ) => Promise<boolean>;
  static isAny: <T extends ActiveRecord$Base<t.Params>>(
    filter?: (record: T) => boolean
  ) => Promise<boolean>;
  static isMany: <T extends ActiveRecord$Base<t.Params>>(
    filter?: (record: T) => boolean
  ) => Promise<boolean>;
  static isNone: <T extends ActiveRecord$Base<t.Params>>(
    filter?: (record: T) => boolean
  ) => Promise<boolean>;
  static isOne: <T extends ActiveRecord$Base<t.Params>>(
    filter?: (record: T) => boolean
  ) => Promise<boolean>;
  static findOrCreateBy: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ) => Promise<T>;
  static findOrCreateByOrThrow: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ) => Promise<T>;
  static findOrInitializeBy: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ) => Promise<T>;
  static createOrFindBy: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params: Partial<U>
  ) => Promise<T>;
  static createOrFindByOrThrow: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params: Partial<U>
  ) => Promise<T>;
  static destroyAll: <T extends ActiveRecord$Base<t.Params>>() => Promise<T[]>;
  static deleteAll: <T extends ActiveRecord$Base<t.Params>>() => Promise<number>;
  static updateAll: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params: Partial<U>
  ) => Promise<number>;
  static touchAll: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params?: Partial<U>,
    opts?: { withCreatedAt?: boolean; time?: string }
  ) => Promise<number>;
  static destroyBy: <T extends ActiveRecord$Base<t.Params>>(
    filter?: (self: T) => boolean
  ) => Promise<T[]>;
  static deleteBy: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params?: Partial<U>
  ) => Promise<number>;
  static where: <T extends ActiveRecord$Base<U>, U extends t.Params = t.Params>(
    params: Partial<U>
  ) => ActiveRecord$Relation<T>;
  static rewhere: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    params: Partial<U>
  ) => ActiveRecord$Relation<T>;
  static order: <
    T extends ActiveRecord$Base<t.Params>,
    U = { [key: string]: rmt.QueryMethods$Directions }
  >(
    params: Partial<U>
  ) => ActiveRecord$Relation<T>;
  static reorder: <
    T extends ActiveRecord$Base<t.Params>,
    U = { [key: string]: rmt.QueryMethods$Directions }
  >(
    params: Partial<U>
  ) => ActiveRecord$Relation<T>;
  static offset: <T extends ActiveRecord$Base<t.Params>>(value: number) => ActiveRecord$Relation<T>;
  static limit: <T extends ActiveRecord$Base<t.Params>>(value: number) => ActiveRecord$Relation<T>;
  static group: <T extends ActiveRecord$Base<U>, U extends t.Params>(
    ...props: Array<keyof U>
  ) => ActiveRecord$Relation<T>;
  static unscope: <T extends ActiveRecord$Base<t.Params>>(
    ...scopeMethods: rmt.QueryMethods$ScopeMethods[]
  ) => ActiveRecord$Relation<T>;

  // ActiveRecord$Meta
  static meta: <T>() => Promise<T>;
  static recordsWithMeta: <T extends ActiveRecord$Base<t.Params>, V = any>() => Promise<[T[], V]>;

  /**
   * prototype
   */

  // ActiveRecord$Persistence
  protected deleteSync: () => this;
  public isNewRecord: () => boolean;
  public isPersisted: () => boolean;
  protected saveSync: (opts?: { validate: boolean }) => boolean;
  protected saveSyncOrThrow: () => void | boolean;
  protected destroySync: () => this;
  public isDestroyed: () => boolean;
  public touch: (opts?: { withCreatedAt?: boolean; time?: string }) => boolean;
  protected updateSync: (params?: Partial<P>) => boolean;
  protected updateSyncOrThrow: (params?: Partial<P>) => boolean;
  public updateAttribute: (name: string, value: any) => boolean;
  /**
   * @alias updateAttribute
   */
  public updateProperty: (name: string, value: any) => boolean;
  /**
   * @alias updateAttribute
   */
  public updateProp: (name: string, value: any) => boolean;

  /**
   * Please override to hit the external API.
   */
  public save: (opts?: { validate: boolean }) => Promise<boolean>;
  public saveOrThrow: (opts?: { validate: boolean }) => Promise<void | boolean>;
  public destroy: <T extends ActiveRecord$Base>() => Promise<T>;
  public update: <U>(params?: Partial<U>) => Promise<boolean>;
  public updateOrThrow: <U>(params?: Partial<U>) => Promise<boolean>;

  // ActiveRecord$Associations
  public buildHasOneRecord: <T extends ActiveRecord$Base>(
    relationName: string,
    params?: Partial<P>
  ) => Promise<T>;
  public buildBelongsToRecord: <T extends ActiveRecord$Base>(
    relationName: string,
    params?: Partial<P>
  ) => Promise<T>;
  public buildAssociationRecord: <T extends ActiveRecord$Base>(
    relationName: string,
    params?: Partial<P>
  ) => Promise<T>;

  // ActiveRecord$Associations$Persistence
  public destroyWithAssociations: () => Promise<this | boolean>;
  protected _destroyAssociations: () => Promise<this[]>;
  public saveWithAssociations: (opts?: { validate: boolean }) => Promise<boolean>;
  public saveWithAssociationsOrThrow: (opts?: { validate: boolean }) => Promise<boolean>;

  // ActiveRecord$AttributeMethods
  public attributes: () => Partial<P>;
  public properties: () => Partial<P>;

  // ActiveRecord$Dirty
  public isChanged: () => boolean;
}

// includes module
ActiveRecord$Associations.rueModuleIncludedFrom(ActiveRecord$Impl, {
  only: ['buildHasOneRecord', 'buildBelongsToRecord', 'buildAssociationRecord'],
});

ActiveRecord$Associations$Persistence.rueModuleIncludedFrom(ActiveRecord$Impl, {
  only: [
    'saveWithAssociations',
    'saveWithAssociationsOrThrow',
    'destroyWithAssociations',
    '_destroyAssociations',
  ],
});

ActiveRecord$Persistence.rueModuleIncludedFrom(ActiveRecord$Impl, {
  only: [
    'deleteSync',
    'isNewRecord',
    'isPersisted',
    'saveSync',
    'saveSyncOrThrow',
    'destroySync',
    'isDestroyed',
    'touch',
    'updateSync',
    'updateSyncOrThrow',
    'updateAttribute',
    'updateProperty',
    'updateProp',
    /**
     * Please override to hit the external API.
     */
    'save',
    'saveOrThrow',
    'destroy',
    'update',
    'updateOrThrow',
  ],
});

ActiveRecord$AttributeMethods.rueModuleIncludedFrom(ActiveRecord$Impl, {
  only: ['attributes', 'properties'],
});

ActiveRecord$Dirty.rueModuleIncludedFrom(ActiveRecord$Impl, {
  only: ['isChanged'],
});

// extend module
ActiveRecord$Persistence.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: [
    'createSync',
    'createSyncOrThrow',
    'deleteSync',
    'destroySync',
    'updateSync',
    'RUE_AUTO_INCREMENT_RECORD_ID',
    'RUE_RECORD_ID',
    'RECORD_ALL',
    /**
     * Please override to hit the external API.
     */
    'create',
    'createOrThrow',
    'delete',
    'destroy',
    'update',
  ],
});
ActiveRecord$Associations.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: ['belongsTo', 'hasOne', 'hasMany'],
});

ActiveRecord$Core.rueModuleExtendedFrom(ActiveRecord$Impl, { only: ['find'] });
ActiveRecord$Scoping.rueModuleExtendedFrom(ActiveRecord$Impl, { only: ['all', 'scope'] });
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

ActiveRecord$Meta.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: ['meta', 'recordsWithMeta'],
});

export { ActiveRecord$Impl };
