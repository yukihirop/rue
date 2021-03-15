// locals
import { ActiveRecord$Base } from '@/records/base';
import { ActiveRecord$Associations$CollectionProxy$Impl } from './impl';
import { ActiveRecord$QueryMethods$Evaluator as Evaluator } from '@/records/relations/modules/query_methods';
import { ActiveRecord$Associations$Relation } from '@/records/associations';
import { ActiveRecord$Associations$CollectionProxy$Holder } from './holder';
import { ActiveRecord$Relation } from '@/records/relations';
import { ActiveRecord$QueryMethods } from '@/records/relations/modules';
import { errObj, ErrCodes } from '@/errors';

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
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-unscope
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
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-pluck
   */
  pluck<U extends rt.Record$Params>(...propNames: Array<keyof U>): Promise<Array<ct.valueOf<U>>> {
    // @ts-expect-error
    return this.scoping<ct.valueOf<U>>((holder) => {
      return holder.scope.map((record) => {
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
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-count
   */
  count<U extends rt.Record$Params>(
    propName?: keyof U,
    filter?: (self: T) => boolean
  ): Promise<number> {
    return this.superThen(({ holder }) => {
      // @ts-expect-error
      return this.recordKlass.all().superThen(({ holder: newHolder }) => {
        // deep coppy
        newHolder.scopeParams = Object.assign({}, JSON.parse(JSON.stringify(holder.scopeParams)));
        Object.assign(newHolder.scopeParams['where'], holder.foreignKeyData);
        Evaluator.all(newHolder);

        let result;
        if (propName) {
          result = newHolder.scope.filter((record) => record[propName]);
        } else {
          result = newHolder.scope;
        }

        if (filter) result = result.filter(filter);

        return result.length;
      });
    });
  }
}

function isPresent(params: any): boolean {
  if (typeof params === 'number') {
    return params >= 0;
  } else if (Array.isArray(params)) {
    return params.length > 0;
  } else if (typeof params === 'object' && params !== null) {
    return params && Object.keys(params).length > 0;
  } else {
    return false;
  }
}

// https://qiita.com/toshihikoyanase/items/7b07ca6a94eb72164257
function isSuperset(target: string[], other: string[]): boolean {
  const self = new Set(target);
  const subset = new Set(other);
  for (let elem of subset) {
    if (!self.has(elem)) {
      return false;
    }
  }
  return true;
}
