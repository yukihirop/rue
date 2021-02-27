// rue packages
import { ActiveSupport$ImplBase as Support$ImplBase } from '@rue/activesupport';
import { ActiveModel$Base } from '@rue/activemodel';

// local
import { ActiveRecord$Base } from '@/records';
import {
  ActiveRecord$Persistence,
  ActiveRecord$FinderMethods,
  ActiveRecord$Associations,
} from '@/records/modules';

// types
import * as at from '@/records/modules/associations';
import * as acpt from '@/records/modules/associations/modules/collection_proxy';

// https://stackoverflow.com/questions/42999765/add-a-method-to-an-existing-class-in-typescript/43000000#43000000
abstract class ActiveRecord$Impl extends ActiveModel$Base {
  // Prepared for checking with hasOwnProperty ()
  static __rue_abstract_class__ = Support$ImplBase.__rue_abstract_class__;
  static __rue_ancestors__ = [];

  // ActiveRecord$Persistence
  static RECORD_ID = ActiveRecord$Persistence.RECORD_ID;
  static RECORD_ALL = ActiveRecord$Persistence.RECORD_ALL;
  static RECORD_AUTO_INCREMENNT_ID = ActiveRecord$Persistence.RECORD_AUTO_INCREMENNT_ID;
  static destroyAll: <T extends ActiveRecord$Base>(filter?: (self: T) => boolean) => T[];
  // ActiveRecord$FinderMethods
  static findBy: <T extends ActiveRecord$Base>(params: { [key: string]: any }) => Promise<T>;
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
    ActiveRecord$Associations.defineAssociations(self);
  }
}

interface ActiveRecord$Impl {
  // ActiveRecord$Persistence
  save(): boolean;
  saveOrThrow(): void | boolean;
  destroy(): ActiveRecord$Base;
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
  only: ['save', 'saveOrThrow', 'destroy'],
});
ActiveRecord$Associations.rueModuleIncludedFrom(ActiveRecord$Impl, {
  only: ['hasAndBelongsToMany', 'releaseAndBelongsToMany'],
});

// extend module
ActiveRecord$Persistence.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: ['destroyAll', 'RECORD_AUTO_INCREMENNT_ID', 'RECORD_ID', 'RECORD_ALL'],
});
ActiveRecord$FinderMethods.rueModuleExtendedFrom(ActiveRecord$Impl, { only: ['findBy'] });
ActiveRecord$Associations.rueModuleExtendedFrom(ActiveRecord$Impl, {
  only: ['belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany', 'scope'],
});

export { ActiveRecord$Impl };
