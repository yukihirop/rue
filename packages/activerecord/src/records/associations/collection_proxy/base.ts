// locals
import { ActiveRecord$Base } from '@/records/base';
import { ActiveRecord$Associations$CollectionProxy$Impl } from './impl';
import { ActiveRecord$QueryMethods$Evaluator as Evaluator } from '@/records/relations/modules/query_methods';

// types
import type * as ct from '@/types';
import type * as rt from '@/index';

export class ActiveRecord$Associations$CollectionProxy$Base<
  T extends ActiveRecord$Base
> extends ActiveRecord$Associations$CollectionProxy$Impl<T> {
  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-build
   */
  build<U>(params?: Partial<U> | Array<Partial<U>>, yielder?: (self: T) => void): Promise<T | T[]> {
    return this._evaluateThen((holder) => {
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
    return this._evaluateThen((holder) => {
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
    return this._evaluateThen((holder) => {
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
    return this._evaluateThen<ct.valueOf<U>>((holder) => {
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
