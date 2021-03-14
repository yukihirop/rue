// rue packages
import { ActiveSupport$ImplBase } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation, ActiveRecord$Relation$Holder } from '@/records/relations';

// modules
import { ActiveRecord$FinderMethods, ActiveRecord$QueryMethods } from './modules';

// types
import type * as at from '@/records/modules/associations';
import type * as mt from './modules';

/**
 * @see https://gist.github.com/domenic/8ed6048b187ee8f2ec75
 * @see https://gist.github.com/oliverfoster/00897f4552cef64653ef14d8b26338a6
 * @see https://github.com/microsoft/TypeScript/issues/12661
 * @todo Reconsider Promise type
 */
abstract class ActiveRecord$Relation$Impl<
  T extends ActiveRecord$Base,
  H extends ActiveRecord$Relation$Holder<T>
> extends Promise<{ holder: H; scope: T[] | PromiseLike<T[]> }> {
  // Prepared for checking with hasOwnProperty ()
  static __rue_impl_class__ = ActiveSupport$ImplBase.__rue_impl_class__;

  /**
   * prototype
   */

  // ActiveRecord$FinderMethods
  find: <P = { [key: string]: any }>(...ids: at.Associations$PrimaryKey[]) => Promise<T | T[]>;
  isExists: <P>(condition?: mt.FinderMethods$ExistsCondition<P>) => Promise<boolean>;
  findBy: <P>(params: Partial<P>) => Promise<T>;
  findByOrThrow: <P>(params: Partial<P>) => Promise<T>;
  first: (limit?: number) => Promise<T | T[]>;
  firstOrThrow: (limit?: number) => Promise<T | T[]>;
  isInclude: (record: T | T[] | Promise<T | T[]>) => Promise<boolean>;
  isMember: (record: T) => Promise<boolean>;
  last: (limit?: number) => Promise<T | T[]>;
  lastOrThrow: (limit?: number) => Promise<T | T[]>;
  take: (limit?: number) => Promise<T | T[]>;
  takeOrThrow: (limit?: number) => Promise<T | T[]>;
  // ActiveRecord$QueryMethods
  where: <U>(params: Partial<U>) => ActiveRecord$Relation<T, H>;
  rewhere: <U>(params: Partial<U>) => ActiveRecord$Relation<T, H>;
  order: <U = { [key: string]: 'desc' | 'asc' | 'DESC' | 'ASC' }>(
    params: Partial<U>
  ) => ActiveRecord$Relation<T, H>;
  reorder: <U = { [key: string]: 'desc' | 'asc' | 'DESC' | 'ASC' }>(
    params: Partial<U>
  ) => ActiveRecord$Relation<T, H>;
  reverseOrder: () => ActiveRecord$Relation<T, H>;
  offset: (value: number) => ActiveRecord$Relation<T, H>;
  limit: (value: number) => ActiveRecord$Relation<T, H>;
  group: <U = { [key: string]: any }>(...props: Array<keyof U>) => ActiveRecord$Relation<T, H>;
  unscope: (...scopeMethods: mt.QueryMethods$ScopeMethods[]) => ActiveRecord$Relation<T, H>;
}

interface ActiveRecord$Relation$Impl<
  T extends ActiveRecord$Base,
  H extends ActiveRecord$Relation$Holder<T>
> {}

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
  ],
});

export { ActiveRecord$Relation$Impl };
