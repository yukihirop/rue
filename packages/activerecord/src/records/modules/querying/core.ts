// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';

// types
import type * as at from '@/records/modules/associations';
import type * as mt from '@/records/relations/modules';

/**
 * this is bound to an instance(class) of ActiveRecord$Base
 * @see https://github.com/rails/rails/blob/5aaaa1630ae9a71b3c3ecc4dc46074d678c08d67/activerecord/lib/active_record/querying.rb#L5-L22
 */
export class ActiveRecord$Querying extends RueModule {
  /**
   * delegate to ActiveRecord$FinderMethods
   */

  static find<T extends ActiveRecord$Base, U = { [key: string]: any }>(
    ...primaryKeys: at.Associations$PrimaryKey[]
  ): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.find<T, U>(...primaryKeys));
  }

  static findBy<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.findBy<T, U>(params));
  }

  static findByOrThrow<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.findByOrThrow<T, U>(params));
  }

  static take<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.take(limit));
  }

  static takeOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.takeOrThrow(limit));
  }

  static first<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.first(limit));
  }

  static firstOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.firstOrThrow(limit));
  }

  static last<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.last(limit));
  }

  static lastOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.lastOrThrow(limit));
  }

  static isExists<T extends ActiveRecord$Base, U>(
    condition?: mt.FinderMethods$ExistsCondition<U>
  ): Promise<boolean> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.isExists<T, U>(condition));
  }

  /**
   * delegate to ActiveRecord$Relation
   */

  static isAny<T extends ActiveRecord$Base>(filter?: (record: T) => boolean): Promise<boolean> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.isAny(filter));
  }

  static isMany<T extends ActiveRecord$Base>(filter?: (record: T) => boolean): Promise<boolean> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.isMany(filter));
  }

  static isNone<T extends ActiveRecord$Base>(filter?: (record: T) => boolean): Promise<boolean> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.isNone(filter));
  }

  static isOne<T extends ActiveRecord$Base>(filter?: (record: T) => boolean): Promise<boolean> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.isOne(filter));
  }

  static findOrCreateBy<T extends ActiveRecord$Base, U>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.findOrCreateBy<U>(params, yielder));
  }

  static findOrCreateByOrThrow<T extends ActiveRecord$Base, U>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.findOrCreateByOrThrow<U>(params, yielder));
  }

  static findOrInitializeBy<T extends ActiveRecord$Base, U>(
    params: Partial<U>,
    yielder?: (self: T) => void
  ): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.findOrInitializeBy<U>(params, yielder));
  }

  static createOrFindBy<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.createOrFindBy<U>(params));
  }

  static createOrFindByOrThrow<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.createOrFindByOrThrow<U>(params));
  }

  static destroyAll<T extends ActiveRecord$Base>(): Promise<T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.destroyAll());
  }

  static deleteAll<T extends ActiveRecord$Base>(): Promise<number> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.deleteAll());
  }

  static updateAll<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<number> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.updateAll<U>(params));
  }

  static touchAll<T extends ActiveRecord$Base, U>(
    params?: Partial<U>,
    opts?: { withCreatedAt?: boolean; time?: string }
  ): Promise<number> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.touchAll<U>(params, opts));
  }

  static destroyBy<T extends ActiveRecord$Base>(filter?: (self: T) => boolean): Promise<T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.destroyBy(filter));
  }

  static deleteBy<T extends ActiveRecord$Base, U>(params?: Partial<U>): Promise<number> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    return _this.all<T>().then((relation) => relation.deleteBy<U>(params));
  }
}
