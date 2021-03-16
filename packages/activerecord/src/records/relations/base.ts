// locals
import { RECORD_ALL, RUE_CREATED_AT, RUE_UPDATED_AT } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';
import { ActiveRecord$Relation$Impl } from './impl';
import { ActiveRecord$QueryMethods$Evaluator as Evaluator } from './modules/query_methods';
import { ActiveRecord$Relation$Holder } from './holder';
import { isPresent } from '@/utils';

// third party
import dayjs from 'dayjs';

// types
import type * as t from './types';
import type * as ct from '@/types';
import type { ActiveRecord$Base } from '@/records/base';

/**
 * @description　Make a copy of the Promise `then` and `catch`
 */
Object.defineProperty(Promise.prototype, '__rue_then__', {
  writable: false,
  configurable: false,
  enumerable: false,
  value: Promise.prototype.then,
});

Object.defineProperty(Promise.prototype, '__rue_catch__', {
  writable: false,
  configurable: false,
  enumerable: false,
  value: Promise.prototype.catch,
});

export class ActiveRecord$Relation$Base<
  T extends ActiveRecord$Base,
  H extends ActiveRecord$Relation$Holder<T> = ActiveRecord$Relation$Holder<T>,
  S = PromiseLike<T[]>
> extends ActiveRecord$Relation$Impl<T, H> {
  protected recordKlass: ct.Constructor<T>;

  constructor(executor: t.PromiseExecutor<T, H, S>) {
    super((resolve, reject) => {
      // @ts-expect-error
      return executor(resolve, reject);
    });
  }

  // instead of constructor
  protected _init(recordKlass: ct.Constructor<T>): this {
    this.recordKlass = recordKlass;
    return this;
  }

  /**
   * @see https://gist.github.com/domenic/8ed6048b187ee8f2ec75
   * @description Method for getting results
   */
  rueThen(onFulfilled: t.PromiseResolve<T, S>, onRejected?: t.PromiseReject<any>) {
    return super.then((value) => {
      /**
       * If you use the `ActiveRecord$QueryMethods` methods, it will enter this branch
       * There are times when 「 value['holder'] instanceof ActiveRecord$Relation$Holder 」 cannot evaluate correctly. (Cause unknown)
       */
      if (
        typeof value === 'object' &&
        value != null &&
        value['holder'] &&
        value['holder']['isHolder']
      ) {
        const { holder, scope } = value;

        if (scope instanceof Promise) {
          scope.then((r) => {
            holder.scope = r;
            Evaluator.all(holder);

            if (Object.keys(holder.groupedRecords).length > 0) {
              return onFulfilled(holder.groupedRecords);
            } else {
              return onFulfilled(holder.scope);
            }
          });
        } else {
          holder.scope = scope as T[];

          Evaluator.all(holder);

          if (Object.keys(holder.groupedRecords).length > 0) {
            return onFulfilled(holder.groupedRecords);
          } else {
            return onFulfilled(holder.scope);
          }
        }
      } else {
        /**
         * value is records ((e.g.) T | T[])
         * @description type error
         */
        // @ts-expect-error
        return onFulfilled(value);
      }
    }, onRejected);
  }

  /**
   * @see https://gist.github.com/domenic/8ed6048b187ee8f2ec75
   * @alias rueThen
   */
  // @ts-expect-error
  then(onFulfilled: t.PromiseResolve<T, S>, onRejected?: t.PromiseReject<any>) {
    return this.rueThen(onFulfilled, onRejected);
  }

  protected superThen(
    onFulfilled: t.PromiseResolveHolder<T, H, S>,
    onRejected?: t.PromiseReject<any>
  ) {
    // @ts-expect-error
    return super.__rue_then__(onFulfilled, onRejected);
  }

  /**
   * @alias rueCatch
   */
  // @ts-expect-error
  catch(errFn: (err: any) => void | PromiseLike<void>) {
    return this.rueCatch(errFn);
  }

  rueCatch(errFn: (err: any) => void | PromiseLike<void>) {
    return (
      super
        // @ts-expect-error
        .__rue_then__((value) => {
          if (
            typeof value === 'object' &&
            value != null &&
            value['holder'] &&
            value['holder']['isHolder']
          ) {
            const { holder } = value;
            Evaluator.all(holder);
            holder.errors.forEach((err) => {
              throw err;
            });
          }
        })
        .__rue_catch__(errFn)
    );
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-scoping
   */
  scoping<U>(callback: (holder: H) => U | Promise<U>): Promise<U> {
    return super.then(({ holder, scope }) => {
      if (scope instanceof Promise) {
        return scope.then((records) => {
          holder.scope = records;
          Evaluator.all(holder);
          return callback(holder);
        });
      } else {
        holder.scope = scope as T[];
        Evaluator.all(holder);
        return callback(holder);
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-many-3F
   */
  isMany(filter?: (record: T) => boolean): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.scope.filter(filter || Boolean).length > 1;
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-none-3F
   */
  isNone(filter?: (record: T) => boolean): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.scope.filter(filter || Boolean).length === 0;
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-one-3F
   */
  isOne(filter?: (record: T) => boolean): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.scope.filter(filter || Boolean).length === 1;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-size
   */
  size(): Promise<number | { [key: string]: number }> {
    return this.scoping<number | { [key: string]: number }>((holder) => {
      if (isPresent(holder.groupedRecords)) {
        return Object.keys(holder.groupedRecords).reduce((acc, key) => {
          const records = holder.groupedRecords[key];
          acc[key] = records.length;
          return acc;
        }, {});
      } else {
        return holder.scope.length;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-any-3F
   */
  isAny(filter?: (record: T) => boolean): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.scope.filter(filter || Boolean).length > 0;
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-blank-3F
   * Returns true if relation is blank.
   */
  isBlank(): Promise<boolean> {
    return this.superThen(({ scope }) => {
      if (scope instanceof Promise) {
        return scope.then((r) => {
          return r.length === 0;
        });
      } else {
        return (scope as T[]).length === 0;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-empty-3F
   */
  isEmpty(): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.scope.length === 0;
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-build
   */
  build<U>(params?: Partial<U> | Array<Partial<U>>, yielder?: (self: T) => void): Promise<T | T[]> {
    return this.scoping((holder) => {
      if (Array.isArray(params)) {
        return params.map((param) => {
          const record = new this.recordKlass(param);
          if (yielder) yielder(record);
          holder.scope.push(record);
          return record;
        });
      } else {
        const record = new this.recordKlass(params);
        if (yielder) yielder(record);
        holder.scope.push(record);
        return record;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-create
   */
  create<U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T | T[]> {
    return this.scoping((holder) => {
      // @ts-ignore
      return this.recordKlass.create(params, (self) => {
        if (yielder) yielder(self);
        holder.scope.push(self);
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-create-21
   */
  createOrThrow<U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T> {
    return this.scoping((holder) => {
      // @ts-expect-error
      return this.recordKlass.createOrThrow(params, (self) => {
        if (yielder) yielder(self);
        holder.scope.push(self);
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-create_or_find_by
   * @todo Support yielder
   */
  createOrFindBy<U>(params: Partial<U>): Promise<T> {
    // @ts-ignore
    return (this.recordKlass as typeof ActiveRecord$Base).findBy(params).then((record) => {
      if (record) {
        return record;
      } else {
        return this.create<Partial<U>>(params);
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-create_or_find_by-21
   * @todo Support yielder
   */
  createOrFindByOrThrow<U>(params: Partial<U>): Promise<T> {
    // @ts-ignore
    return (this.recordKlass as typeof ActiveRecord$Base).findBy<T, U>(params).then((record) => {
      if (record) {
        return record;
      } else {
        return this.createOrThrow<U>(params);
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-delete_by
   */
  deleteBy<U>(params?: Partial<U>): Promise<number> {
    const deleteRecordFn = (record: T): boolean => {
      return !!record.destroy();
    };

    return (
      this.recordKlass
        // @ts-ignore
        .where<T, U>(params)
        .superThen(({ holder }) => {
          Evaluator.all(holder);
          return Promise.all(holder.scope.map(deleteRecordFn)).then((result) => {
            return result.filter(Boolean).length;
          });
        })
    );
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-delete_all
   */
  deleteAll(): Promise<number> {
    return this.scoping<number>((holder) => {
      const deleteCount = holder.scope.length;
      RecordCache.update(this.recordKlass.name, RECORD_ALL, []);
      holder.scope = [];
      return deleteCount;
    });
  }

  /**
   * @see https://github.com/rails/rails/blob/5aaaa1630ae9a71b3c3ecc4dc46074d678c08d67/activerecord/lib/active_record/relation.rb#L613-L615
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-destroy_by
   * @todo Use ActiveRecord$QueryMethods#where
   */
  destroyBy(filter?: (self: T) => boolean): Promise<T[]> {
    return this.superThen(({ holder }) => {
      let leavedData = [];
      let deleteData = [];

      holder.scope.forEach((record) => {
        if (filter) {
          if (filter(record)) {
            deleteData.push(record);
          } else {
            leavedData.push(record);
          }
        } else {
          deleteData.push(record);
        }
      });

      RecordCache.update(this.recordKlass.name, RECORD_ALL, leavedData);
      holder.scope = leavedData;

      Evaluator.all(holder);

      deleteData.forEach((record) => {
        record._destroyed = true;
        Object.freeze(record);
      });
      return deleteData;
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-destroy_all
   */
  destroyAll(): Promise<T[]> {
    return this.scoping((holder) => {
      const destroyed = holder.scope.map((record: T) => {
        const destroyed = record.destroy();
        Object.freeze(destroyed);
        return destroyed;
      });
      holder.scope = [];
      return destroyed;
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-find_or_create_by
   */
  findOrCreateBy<U>(params: Partial<U>, yielder?: (self: T) => void): Promise<T> {
    return this.findBy<U>(params).then((record) => {
      if (record) {
        if (yielder) yielder(record);
        return record;
      } else {
        return this.create<Partial<U>>(params).then((createdRecord: T) => {
          if (yielder) yielder(createdRecord);
          return createdRecord;
        });
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-find_or_create_by-21
   */
  findOrCreateByOrThrow<U>(params: Partial<U>, yielder?: (self: T) => void): Promise<T> {
    // @ts-ignore
    return this.recordKlass.findBy<T, U>(params).then((record) => {
      if (record) {
        if (yielder) yielder(record);
        return record;
      } else {
        return this.createOrThrow<Partial<U>>(params).then((createdRecord) => {
          if (yielder) yielder(createdRecord);
          return createdRecord;
        });
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-find_or_initialize_by
   */
  findOrInitializeBy<U>(params: Partial<U>, yielder?: (self: T) => void): Promise<T> {
    // @ts-ignore
    return this.recordKlass.findBy<T, U>(params).then((record) => {
      if (record) {
        if (yielder) yielder(record);
        return record;
      } else {
        const newRecord = new this.recordKlass(params);
        // @ts-expect-error
        newRecord._newRecord = true;
        if (yielder) yielder(newRecord);
        return newRecord;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-update_all
   */
  updateAll<U>(params: Partial<U>): Promise<number> {
    const updateFn = (record: T): boolean => {
      return record.update(params);
    };

    return this.scoping<number>((holder) => {
      return Promise.all(holder.scope.map(updateFn)).then((result) => {
        return result.filter(Boolean).length;
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-touch_all
   */
  touchAll<U>(
    params?: Partial<U>,
    opts?: { withCreatedAt?: boolean; time?: string }
  ): Promise<number> {
    const updateProps =
      opts && opts.withCreatedAt ? [RUE_CREATED_AT, RUE_UPDATED_AT] : [RUE_UPDATED_AT];
    const datetime = opts && opts.time ? dayjs(opts.time).format() : dayjs().format();

    const touchFn = (record: T): boolean => {
      updateProps.forEach((timestamp) => {
        record.update({ [timestamp]: datetime });
      });
      return true;
    };

    return (
      this.recordKlass
        // @ts-expect-error
        .where<T, U>(params)
        .superThen(({ holder }) => {
          Evaluator.all(holder);
          return Promise.all(holder.scope.map(touchFn)).then((result) => {
            holder.scope = RecordCache.read(holder.recordKlass.name, RECORD_ALL, 'array');
            return result.filter(Boolean).length;
          });
        })
    );
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-to_a
   */
  toA(): Promise<T[]> {
    return this.scoping((holder) => {
      return holder.scope;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-to_a
   */
  toArray(): Promise<T[]> {
    return this.toA();
  }
}
