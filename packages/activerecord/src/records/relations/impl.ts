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

abstract class ActiveRecord$Relation$Impl<T extends ActiveRecord$Base> {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = ActiveSupport$ImplBase.__rue_impl_class__;
}

interface ActiveRecord$Relation$Impl<T extends ActiveRecord$Base> {
  // ActiveRecord$FinderMethods
  find<U = { [key: string]: any }>(...ids: at.Associations$PrimaryKey[]): Promise<T | T[]>;
  isExists<U>(condition?: mt.FinderMethods$ExistsCondition<U>): Promise<boolean>;
  findBy<U>(params: Partial<U>): Promise<T>;
  findByOrThrow<U>(params: Partial<U>): Promise<T>;
  first(limit?: number): Promise<T | T[]>;
  firstOrThrow(limit?: number): Promise<T | T[]>;
  isInclude(record: T): boolean;
  isMember(record: T): boolean;
  last(limit?: number): Promise<T | T[]>;
  lastOrThrow(limit?: number): Promise<T | T[]>;
  take(limit?: number): Promise<T | T[]>;
  takeOrThrow(limit?: number): Promise<T | T[]>;
  // ActiveRecord$QueryMethods
  where<U>(params: Partial<U>): ActiveRecord$Relation<T>;
  rewhere<U>(params: Partial<U>): ActiveRecord$Relation<T>;
  order<U = { [key: string]: 'desc' | 'asc' | 'DESC' | 'ASC' }>(
    params: Partial<U>
  ): ActiveRecord$Relation<T>;
  reorder<U = { [key: string]: 'desc' | 'asc' | 'DESC' | 'ASC' }>(
    params: Partial<U>
  ): ActiveRecord$Relation<T>;
  reverseOrder(): ActiveRecord$Relation<T>;
  offset(value: number): ActiveRecord$Relation<T>;
  limit(value: number): ActiveRecord$Relation<T>;
  group<U = { [key: string]: any }>(...props: Array<keyof U>): ActiveRecord$Relation<T>;
  unscope(...scopeMethods: mt.QueryMethods$ScopeMethods[]): ActiveRecord$Relation<T>;
  // inner methods
  toPromiseArray(): Promise<T[] | { [key: string]: T[] }>;
  toPA(): Promise<T[] | { [key: string]: T[] }>;
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
  only: [
    'where',
    'rewhere',
    'order',
    'reorder',
    'reverseOrder',
    'offset',
    'limit',
    'group',
    'unscope',
    'toPromiseArray',
    'toPA',
  ],
});

export { ActiveRecord$Relation$Impl };
