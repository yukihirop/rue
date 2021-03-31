// locals
import { ActiveRecord$Base } from '@/records/base';
import { ActiveRecord$Associations$CollectionProxy$Impl } from './impl';
import { ActiveRecord$QueryMethods$Evaluator as Evaluator } from '@/records/relations/modules/query_methods';
import { ActiveRecord$Associations$Relation } from '@/records/associations';
import { ActiveRecord$Associations$CollectionProxy$Holder } from './holder';
import { ActiveRecord$Relation } from '@/records/relations';
import { ActiveRecord$QueryMethods } from '@/records/relations/modules';
import { errObj, ErrCodes } from '@/errors';
import { isPresent, isSuperset } from '@/utils';

// types
import type * as ct from '@/types';
import type * as it from '@/index';
import type * as rmt from '@/records/relations/modules';
import type * as rt from '@/records/relations/types';

export class ActiveRecord$Associations$CollectionProxy$Base<
  T extends ActiveRecord$Base
> extends ActiveRecord$Associations$CollectionProxy$Impl<T> {
  /**
   * @see https://gist.github.com/domenic/8ed6048b187ee8f2ec75
   * @description Method for getting results. Do not call it in any other method.
   */
  rueThen(
    onFulfilled: rt.PromiseResolve<T, ActiveRecord$Relation<T>>,
    onRejected?: rt.PromiseReject<any>
  ) {
    return this.superThen((value) => {
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
          scope.rueThen((r) => {
            holder.scope = r as T[];
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
   * @description All methods are delegated to this instance
   * @see https://github.com/rails/rails/blob/5aaaa1630ae9a71b3c3ecc4dc46074d678c08d67/activerecord/lib/active_record/associations/collection_proxy.rb#L1100-L1109
   */
  scope(): ActiveRecord$Associations$Relation<
    T,
    ActiveRecord$Associations$CollectionProxy$Holder<T>,
    ActiveRecord$Relation<T>
  > {
    return this.superThen(({ holder, scope }) => {
      return { scope, holder };
    });
  }

  /**
   * @see https://github.com/rails/rails/blob/5aaaa1630ae9a71b3c3ecc4dc46074d678c08d67/activerecord/lib/active_record/associations/collection_proxy.rb#L1100-L1109
   */
  scoping<U>(
    callback: (holder: ActiveRecord$Associations$CollectionProxy$Holder<T>) => U | Promise<U>
  ): Promise<U> {
    return this.superThen(({ holder, scope }) => {
      if (scope instanceof Promise) {
        return scope.rueThen((records) => {
          holder.scope = records as T[];
          /**
           * @description Pass by value so that 「proxy === record」 does not occur
           */
          if (Object.keys(holder.proxy).length === 0) holder.proxy = Array.from(records as T[]);
          Evaluator.all(holder);
          return callback(holder);
        });
      } else {
        holder.scope = scope as T[];
        /**
         * @description Pass by value so that 「proxy === record」 does not occur
         */
        if (Object.keys(holder.proxy).length === 0) holder.proxy = Array.from(scope);
        Evaluator.all(holder);
        return callback(holder);
      }
    });
  }

  /**
   * @description delegate to `scope`
   */
  // @ts-expect-error
  where<U extends it.Record$Params>(params: Partial<U>): this {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      Object.assign(holder.scopeParams.where, params || {});
    });

    return this;
  }

  /**
   * @description delegate to `scope`
   */
  // @ts-expect-error
  rewhere<U extends it.Record$Params>(params: Partial<U>): this {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      holder.scopeParams.where = params || {};
      Object.assign(params, holder.foreignKeyData);
    });

    return this;
  }

  /**
   * @description delegate to `scope`
   */
  // @ts-expect-error
  order<U = { [key: string]: rmt.QueryMethods$Directions }>(params: U): this {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      Object.assign(holder.scopeParams.order, params || {});
    });

    return this;
  }

  /**
   * @description delegate to `scope`
   */
  // @ts-expect-error
  reorder<U = { [key: string]: rmt.QueryMethods$Directions }>(params: U): this {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      holder.scopeParams.order = params || {};
    });

    return this;
  }

  /**
   * @description delegate to `scope`
   */
  // @ts-expect-error
  reverseOrder(): this {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      const orderParams = holder.scopeParams.order;
      if (isPresent(orderParams)) {
        Object.keys(orderParams).forEach((propName) => {
          const direction = orderParams[propName];
          if (['desc', 'DESC'].includes(direction)) {
            holder.scopeParams.order[propName] = 'asc';
          } else if (['asc', 'ASC'].includes(direction)) {
            holder.scopeParams.order[propName] = 'desc';
          }
        });
      } else {
        holder.scopeParams.order['id'] = 'asc';
      }
    });

    return this;
  }

  /**
   * @description delegate to `scope`
   */
  // @ts-expect-error
  offset(value: number): this {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      holder.scopeParams.offset = value;
    });

    return this;
  }

  /**
   * @description delegate to `scope`
   */
  // @ts-expect-error
  limit(value: number): this {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      holder.scopeParams.limit = value;
    });

    return this;
  }

  /**
   * @description Behavior is different from rails group
   * @description delegate to `scope`
   */
  // @ts-expect-error
  group<U = { [key: string]: any }>(...props: Array<keyof U>): this {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      // @ts-expect-error
      holder.scopeParams.group = props;
    });

    return this;
  }

  /**
   * @description delegate to `scope`
   */
  // @ts-expect-error
  unscope(...scopeMethods: rmt.QueryMethods$ScopeMethods[]): this {
    const { SCOPE_METHODS } = ActiveRecord$QueryMethods;

    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      if (scopeMethods.length === 0) {
        const err = errObj({
          code: ErrCodes.ARGUMENT_IS_INVALID,
          message: `'unscope()' must contain arguments.`,
        });
        holder.errors.push(err);
      } else if (isSuperset(SCOPE_METHODS, scopeMethods)) {
        scopeMethods.forEach((scopeMethod) => {
          // @ts-expect-error
          if (holder._defaultScopeParams[scopeMethod]) {
            holder.scopeParams[scopeMethod] = Object.assign(
              {},
              // @ts-expect-error
              JSON.parse(JSON.stringify(holder._defaultScopeParams[scopeMethod]))
            );
          } else {
            holder.scopeParams[scopeMethod] = undefined;
          }
        });
      } else {
        const err = errObj({
          code: ErrCodes.ARGUMENT_IS_INVALID,
          message: `Called 'unscope()' with invalid unscoping argument '[${scopeMethods}]'. Valid arguments are '[${SCOPE_METHODS}]'.`,
        });
        holder.errors.push(err);
      }
    });

    return this;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-empty-3F
   * @description use holder.proxy
   */
  isEmpty(): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.proxy.length === 0;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-find
   */
  // @ts-expect-error
  find<U extends it.Record$Params>(...ids: it.Record$PrimaryKey[]): Promise<T | T[]> {
    if (ids.length === 0) {
      throw errObj({
        code: ErrCodes.RECORD_NOT_FOUND,
        // @ts-expect-error
        message: `Could'nt find '${this.recordKlass.uniqueKey}' without an 'id'`,
      });
    } else {
      // @ts-expect-error
      return this.where<U>({ id: ids }).scoping((holder) => {
        if (holder.scope.length === 0) {
          if (ids.length === 1) {
            throw errObj({
              code: ErrCodes.RECORD_NOT_FOUND,
              params: {
                // @ts-expect-error
                resource: this.recordKlass.uniqueKey,
                id: ids[0],
              },
            });
          } else {
            throw errObj({
              code: ErrCodes.RECORD_NOT_FOUND,
              // @ts-expect-error
              message: `Could't find all '${this.recordKlass.uniqueKey}' with 'id': [${ids}] (found 0 results, but was looking for ${ids.length})`,
            });
          }
        } else if (holder.scope.length === 1) {
          return holder.scope[0];
        } else {
          return holder.scope;
        }
      });
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-any-3F
   * @description use holder.proxy
   */
  isAny(filter?: (record: T) => boolean): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.proxy.filter(filter || Boolean).length > 0;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-build
   * @description use holder.proxy
   */
  build<U>(params?: Partial<U> | Array<Partial<U>>, yielder?: (self: T) => void): Promise<T | T[]> {
    return this.scoping((holder) => {
      holder.flags.useProxy = true;
      if (Array.isArray(params)) {
        return params.map((param) => {
          const merged = Object.assign(param || {}, holder.foreignKeyData);
          const record = new this.recordKlass(merged);
          if (yielder) yielder(record);
          holder.proxy.push(record);
          return record;
        });
      } else {
        const merged = Object.assign(params || {}, holder.foreignKeyData);
        const record = new this.recordKlass(merged);
        if (yielder) yielder(record);
        holder.proxy.push(record);
        return record;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-create
   * @description use holder.proxy
   */
  create<U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T | T[]> {
    return this.scoping((holder) => {
      const merged = Object.assign(params || {}, holder.foreignKeyData);
      // @ts-ignore
      return this.recordKlass.create(merged, (self) => {
        if (yielder) yielder(self);
        holder.scope.push(self);
        holder.proxy.push(self);
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-create-21
   * @description use holder.proxy
   */
  createOrThrow<U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T> {
    return this.scoping((holder) => {
      const merged = Object.assign(params || {}, holder.foreignKeyData);
      // @ts-expect-error
      return this.recordKlass.createOrThrow(merged, (self) => {
        if (yielder) yielder(self);
        holder.scope.push(self);
        holder.proxy.push(self);
      });
    });
  }

  /**
   * The return value type is different from that of rails.
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-delete
   */
  delete(...recordsOrIds: T[] | it.Record$PrimaryKey[]): Promise<T[]> {
    return this.scoping<T[]>((holder) => {
      let recordIds: it.Record$PrimaryKey[] = [];

      recordsOrIds.forEach((recordOrId) => {
        if (recordOrId instanceof ActiveRecord$Base) {
          recordIds.push((recordOrId as T).id);
        } else {
          recordIds.push(recordOrId);
        }
      });

      return this.find<T>(...recordIds).then((records: T[]) => {
        const foreignKey = Object.keys(holder.foreignKeyData)[0];
        const deletedRecords = records.map((record) => {
          // dependent: 'nullify'
          record.update({ [foreignKey]: undefined });
          return record;
        });
        const destroyedIds = deletedRecords.map((r) => r.id);
        const newScope = Array.from(holder.scope).reduce((acc, record) => {
          if (!destroyedIds.includes(record.id)) {
            acc.push(record);
          }
          return acc;
        }, []);
        holder.scope = Array.from(newScope);
        holder.proxy = Array.from(newScope);
        return deletedRecords;
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-destroy
   * @description use holder.proxy
   */
  destroy(...recordsOrIds: T[] | it.Record$PrimaryKey[]): Promise<T[] | null> {
    return this.scoping((holder) => {
      let recordIds: it.Record$PrimaryKey[] = [];

      recordsOrIds.forEach((recordOrId) => {
        if (recordOrId instanceof ActiveRecord$Base) {
          recordIds.push((recordOrId as T).id);
        } else {
          recordIds.push(recordOrId);
        }
      });

      if (recordIds.length === 0) {
        /**
         * @description Make it behave the same as rails
         */
        return null;
      } else {
        return this.find<T>(...recordIds).then((records: T[]) => {
          const destroyedRecords = records.map((record) => {
            return record.destroySync();
          });
          const destroyedIds = destroyedRecords.map((r) => r.id);
          const newScope = Array.from(holder.scope).reduce((acc, record) => {
            if (!destroyedIds.includes(record.id)) {
              acc.push(record);
            }
            return acc;
          }, []);
          holder.scope = Array.from(newScope);
          holder.proxy = Array.from(newScope);
          return destroyedRecords;
        });
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-pluck
   * @description use holder.proxy
   */
  pluck<U extends it.Record$Params>(...propNames: Array<keyof U>): Promise<Array<ct.valueOf<U>>> {
    return this.scoping<Array<ct.valueOf<U>>>((holder) => {
      const plucked = holder.proxy.map((record) => {
        let result;

        if (propNames.length === 0) {
          result = Object.keys(record).reduce((acc, propName: string) => {
            if (
              !propName.startsWith('_') &&
              !(typeof record[propName] === 'function') &&
              !(propName == 'errors')
            ) {
              acc.push(record[propName]);
            }
            return acc;
          }, [] as Array<ct.valueOf<U>>);
        } else {
          result = propNames.reduce((acc, propName: string) => {
            acc.push(record[propName]);
            return acc;
          }, [] as Array<ct.valueOf<U>>);
        }
        return result;
      });

      if (propNames.length === 1) {
        return plucked.flat();
      } else {
        return plucked;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-count
   */
  count<U extends it.Record$Params>(
    propName?: keyof U,
    filter?: (self: T) => boolean
  ): Promise<number | { [key: string]: number }> {
    return this.superThen(({ holder }) => {
      // @ts-expect-error
      return this.recordKlass.all().superThen(({ holder: newHolder }) => {
        // deep coppy
        newHolder.scopeParams = Object.assign({}, JSON.parse(JSON.stringify(holder.scopeParams)));
        Object.assign(newHolder.scopeParams.where, holder.foreignKeyData);
        Evaluator.all(newHolder);

        if (isPresent(newHolder.groupedRecords)) {
          return Object.keys(newHolder.groupedRecords).reduce((acc, key) => {
            const records = newHolder.groupedRecords[key];
            acc[key] = records.length;
            return acc;
          }, {});
        } else {
          let result;

          if (propName) {
            result = newHolder.scope.filter((record) => record[propName]);
          } else {
            result = newHolder.scope;
          }

          if (filter) result = result.filter(filter);
          return result.length;
        }
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-first
   * @description use holder.proxy
   */
  // @ts-expect-error
  first(limit?: number): Promise<T | T[]> {
    if (!limit) limit = 1;
    return this.scoping((holder) => {
      const records = holder.proxy;
      if (records.length === 0) {
        return null;
      } else {
        const slicedRecords = records.slice(0, limit);

        if (limit === 1) return slicedRecords[0];
        return slicedRecords;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-include-3F
   * @description use holder.proxy
   */
  // @ts-expect-error
  isInclude(record: T | T[] | Promise<T | T[]>): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      const allRecordIds = holder.proxy.map((r) => r['id']);
      if (record instanceof Promise) {
        return record.then((recordVal) => {
          if (recordVal && !Array.isArray(recordVal)) {
            return allRecordIds.includes(recordVal['id']);
          } else {
            /**
             * @description Same specifications as rails
             */
            return false;
          }
        });
      } else {
        if (record && !Array.isArray(record)) {
          return allRecordIds.includes(record['id']);
        } else {
          /**
           * @description Same specifications as rails
           */
          return false;
        }
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-last
   * @description use holder.proxy
   */
  // @ts-expect-error
  last(limit?: number): Promise<T | T[]> {
    if (!limit) limit = 1;
    return this.scoping((holder) => {
      const records = holder.proxy;
      if (records.length === 0) {
        return null;
      } else {
        const slicedRecords = records.reverse().slice(0, limit).reverse();

        if (limit === 1) return slicedRecords[0];
        return slicedRecords;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-many-3F
   * @description use holder.proxy
   */
  isMany(filter?: (record: T) => boolean): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.proxy.filter(filter || Boolean).length > 1;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-size
   * @description use holder.proxy
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
        return holder.proxy.length;
      }
    });
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

  _currentScope(): Promise<T[]> {
    return this.scoping((holder) => {
      if (holder.flags.useProxy) {
        return holder.proxy;
      } else {
        return holder.scope;
      }
    });
  }
}
