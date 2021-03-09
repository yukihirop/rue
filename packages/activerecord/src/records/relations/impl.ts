// rue packages
import { ActiveSupport$ImplBase } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';

// modules
import { ActiveRecord$FinderMethods, ActiveRecord$QueryMethods } from './modules';

// types
import type * as at from '@/records/modules/associations';
import type * as mt from './modules';

abstract class ActiveRecord$Relation$Impl {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = ActiveSupport$ImplBase.__rue_impl_class__;
}

interface ActiveRecord$Relation$Impl {
  // ActiveRecord$FinderMethods
  find<T extends ActiveRecord$Base, U = { [key: string]: any }>(
    ...primaryKeys: at.Associations$PrimaryKey[]
  ): Promise<T | T[]>;
  isExists<T extends ActiveRecord$Base, U>(
    condition?: mt.FinderMethods$ExistsCondition<U>
  ): Promise<boolean>;
  findBy<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T>;
  findByOrThrow<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T>;
  first<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]>;
  firstOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]>;
  isInclude<T extends ActiveRecord$Base>(record: T): boolean;
  isMember<T extends ActiveRecord$Base>(record: T): boolean;
  last<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]>;
  lastOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]>;
  take<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]>;
  takeOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]>;
  // ActiveRecord$QueryMethods
  where<T extends ActiveRecord$Base, U>(params: Partial<U>): ActiveRecord$Relation<T>;
  rewhere<T extends ActiveRecord$Base, U>(params: Partial<U>): ActiveRecord$Relation<T>;
  // inner methods
  toPromiseArray<T extends ActiveRecord$Base>(): Promise<T[]>;
  toPA<T extends ActiveRecord$Base>(): Promise<T[]>;
}

ActiveRecord$FinderMethods.rueModuleIncludedFrom(ActiveRecord$Relation$Impl, {
  only: [
    'isExists',
    'find',
    'findBy',
    'findByOrThrow',
    'first',
    'firstOrThrow',
    'isInclude',
    'isMember',
    'last',
    'lastOrThrow',
    'take',
    'takeOrThrow',
  ],
});
ActiveRecord$QueryMethods.rueModuleIncludedFrom(ActiveRecord$Relation$Impl, {
  only: ['where', 'rewhere'],
});

export { ActiveRecord$Relation$Impl };
