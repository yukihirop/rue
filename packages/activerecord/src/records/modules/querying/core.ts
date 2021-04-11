// rue packages
import { RueModule } from '@ruejs/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';

// types
import type * as at from '@/records/modules/associations';
import type * as rmt from '@/records/relations/modules';

/**
 * this is bound to an instance(class) of ActiveRecord$Base
 * @see https://github.com/rails/rails/blob/5aaaa1630ae9a71b3c3ecc4dc46074d678c08d67/activerecord/lib/active_record/querying.rb#L5-L22
 */
export class ActiveRecord$Querying extends RueModule {
  /**
   * delegate to ActiveRecord$FinderMethods
   */

  static find<T extends ActiveRecord$Base, U = { [key: string]: any }>(
    ...ids: at.Associations$PrimaryKey[]
  ): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().find<U>(...ids);
  }

  static findBy<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().findBy<U>(params);
  }

  static findByOrThrow<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().findByOrThrow<U>(params);
  }

  static take<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().take(limit);
  }

  static takeOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().takeOrThrow(limit);
  }

  static first<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().first(limit);
  }

  static firstOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().firstOrThrow(limit);
  }

  static last<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().last(limit);
  }

  static lastOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().lastOrThrow(limit);
  }

  static isExists<T extends ActiveRecord$Base, U>(
    condition?: rmt.FinderMethods$ExistsCondition<U>
  ): Promise<boolean> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().isExists<U>(condition);
  }

  /**
   * delegate to ActiveRecord$Relation
   */

  static isAny<T extends ActiveRecord$Base>(filter?: (record: T) => boolean): Promise<boolean> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().isAny(filter);
  }

  static isMany<T extends ActiveRecord$Base>(filter?: (record: T) => boolean): Promise<boolean> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().isMany(filter);
  }

  static isNone<T extends ActiveRecord$Base>(filter?: (record: T) => boolean): Promise<boolean> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().isNone(filter);
  }

  static isOne<T extends ActiveRecord$Base>(filter?: (record: T) => boolean): Promise<boolean> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().isOne(filter);
  }

  static findOrCreateBy<T extends ActiveRecord$Base, U>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().findOrCreateBy<U>(params, yielder);
  }

  static findOrCreateByOrThrow<T extends ActiveRecord$Base, U>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().findOrCreateByOrThrow<U>(params, yielder);
  }

  static findOrInitializeBy<T extends ActiveRecord$Base, U>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().findOrInitializeBy<U>(params, yielder);
  }

  static createOrFindBy<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().createOrFindBy<U>(params);
  }

  static createOrFindByOrThrow<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().createOrFindByOrThrow<U>(params);
  }

  static destroyAll<T extends ActiveRecord$Base>(): Promise<T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().destroyAll();
  }

  static deleteAll<T extends ActiveRecord$Base>(): Promise<number> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().deleteAll();
  }

  static updateAll<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<number> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().updateAll<U>(params);
  }

  static touchAll<T extends ActiveRecord$Base, U>(
    params?: Partial<U>,
    opts?: { withCreatedAt?: boolean; time?: string }
  ): Promise<number> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().touchAll<U>(params, opts);
  }

  static destroyBy<T extends ActiveRecord$Base>(filter?: (self: T) => boolean): Promise<T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().destroyBy(filter);
  }

  static deleteBy<T extends ActiveRecord$Base, U>(params?: Partial<U>): Promise<number> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().deleteBy<U>(params);
  }

  /**
   * delegate to ActiveRecord$QueryMethods
   */

  static where<T extends ActiveRecord$Base, U>(params: Partial<U>): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().where<U>(params);
  }

  static rewhere<T extends ActiveRecord$Base, U>(params: Partial<U>): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().rewhere<U>(params);
  }

  static order<T extends ActiveRecord$Base, U = { [key: string]: rmt.QueryMethods$Directions }>(
    params: Partial<U>
  ): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().order<U>(params);
  }

  static reorder<T extends ActiveRecord$Base, U = { [key: string]: rmt.QueryMethods$Directions }>(
    params: Partial<U>
  ): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().reorder<U>(params);
  }

  static offset<T extends ActiveRecord$Base>(value: number): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().offset(value);
  }

  static limit<T extends ActiveRecord$Base>(value: number): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().limit(value);
  }

  static group<T extends ActiveRecord$Base, U = { [key: string]: any }>(
    ...props: Array<keyof U>
  ): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().group<U>(...props);
  }

  static unscope<T extends ActiveRecord$Base>(
    ...scopeMethods: rmt.QueryMethods$ScopeMethods[]
  ): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().unscope(...scopeMethods);
  }
}
