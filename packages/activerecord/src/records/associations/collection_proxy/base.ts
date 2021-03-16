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
import type * as rt from '@/index';
import type * as rmt from '@/records/relations/modules';

export class ActiveRecord$Associations$CollectionProxy$Base<
  T extends ActiveRecord$Base
> extends ActiveRecord$Associations$CollectionProxy$Impl<T> {
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
   * @description delegate to `scope`
   */
  // @ts-expect-error
  where<U extends rt.Record$Params>(params: Partial<U>): this {
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
  rewhere<U extends rt.Record$Params>(params: Partial<U>): this {
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
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-find
   */
  // @ts-expect-error
  find<U extends rt.Record$Params>(...ids: rt.Record$PrimaryKey[]): Promise<T | T[]> {
    if (ids.length === 0) {
      throw errObj({
        code: ErrCodes.RECORD_NOT_FOUND,
        message: `Could'nt find '${this.recordKlass.name}' without an 'id'`,
      });
    } else {
      // @ts-expect-error
      return this.where<U>({ id: ids }).scoping((holder) => {
        if (holder.scope.length === 0) {
          if (ids.length === 1) {
            throw errObj({
              code: ErrCodes.RECORD_NOT_FOUND,
              params: {
                resource: this.recordKlass.name,
                id: ids[0],
              },
            });
          } else {
            throw errObj({
              code: ErrCodes.RECORD_NOT_FOUND,
              message: `Could't find all '${this.recordKlass.name}' with 'id': [${ids}] (found 0 results, but was looking for ${ids.length})`,
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
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-build
   */
  build<U>(params?: Partial<U> | Array<Partial<U>>, yielder?: (self: T) => void): Promise<T | T[]> {
    return this.scoping((holder) => {
      if (Array.isArray(params)) {
        return params.map((param) => {
          const merged = Object.assign(param || {}, holder.foreignKeyData);
          const record = new this.recordKlass(merged);
          if (yielder) yielder(record);
          holder.scope.push(record);
          return record;
        });
      } else {
        const merged = Object.assign(params || {}, holder.foreignKeyData);
        const record = new this.recordKlass(merged);
        if (yielder) yielder(record);
        holder.scope.push(record);
        return record;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-create
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
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-create-21
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
      });
    });
  }

  /**
   * The return value type is different from that of rails.
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-delete
   */
  delete(...recordsOrIds: T[] | rt.Record$PrimaryKey[]): Promise<T[]> {
    return this.scoping<T[]>((holder) => {
      let recordIds: rt.Record$PrimaryKey[] = [];

      recordsOrIds.forEach((recordOrId) => {
        if (recordOrId instanceof ActiveRecord$Base) {
          recordIds.push((recordOrId as T).id);
        } else {
          recordIds.push(recordOrId);
        }
      });

      return this.find<T>(...recordIds).then((records: T[]) => {
        const foreignKey = Object.keys(holder.foreignKeyData)[0];
        return records.map((record) => {
          // dependent: 'nullify'
          record.update({ [foreignKey]: undefined });
          return record;
        });
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-destroy
   */
  destroy(...recordsOrIds: T[] | rt.Record$PrimaryKey[]): Promise<T[] | null> {
    return this.scoping((holder) => {
      let recordIds: rt.Record$PrimaryKey[] = [];

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
          return records.map((record) => {
            return record.destroy();
          });
        });
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-pluck
   */
  pluck<U extends rt.Record$Params>(...propNames: Array<keyof U>): Promise<Array<ct.valueOf<U>>> {
    return this.scoping<Array<ct.valueOf<U>>>((holder) => {
      const plucked = holder.scope.map((record) => {
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
  count<U extends rt.Record$Params>(
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
}
