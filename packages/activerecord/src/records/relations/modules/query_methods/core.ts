import { RueModule } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';
import { ErrCodes, errObj } from '@/errors';
import { ActiveRecord$QueryMethods$Evaluator as Evaluator } from './evaluator';

// types
import type * as t from './types';

// this is bound to an instance(class) of ActiveRecord$Relation (include runtime class)
export class ActiveRecord$QueryMethods extends RueModule {
  private static SCOPE_METHODS = ['where', 'order', 'offset', 'limit', 'group'];
  /**
   * Records cannot be created correctly without lazy evaluation
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-where
   */
  where<T extends ActiveRecord$Base, U>(params: Partial<U>): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    Object.assign(_this._scopeParams['where'], params || {});
    // @ts-expect-error
    _this._currentScopeFn = _this.toPromiseArray;
    return _this;
  }

  /**
   * Records cannot be created correctly without lazy evaluation
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-rewhere
   */
  rewhere<T extends ActiveRecord$Base, U>(params: Partial<U>): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    _this._scopeParams['where'] = params || {};
    // @ts-expect-error
    _this._currentScopeFn = _this.toPromiseArray;
    return _this;
  }

  /**
   * Records cannot be created correctly without lazy evaluation
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-order
   */
  order<T extends ActiveRecord$Base, U = { [key: string]: t.Directions }>(
    params: Partial<U>
  ): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    Object.assign(_this._scopeParams['order'], params || {});
    // @ts-expect-error
    _this._currentScopeFn = _this.toPromiseArray;
    return _this;
  }

  /**
   * Records cannot be created correctly without lazy evaluation
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-reorder
   */
  reorder<T extends ActiveRecord$Base, U = { [key: string]: t.Directions }>(
    params: Partial<U>
  ): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    _this._scopeParams['order'] = params || {};
    // @ts-expect-error
    _this._currentScopeFn = _this.toPromiseArray;
    return _this;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-reverse_order
   */
  reverseOrder<T extends ActiveRecord$Base>(): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    const orderParams = _this._scopeParams['order'];
    if (isPresent(orderParams)) {
      Object.keys(orderParams).forEach((propName) => {
        const direction = orderParams[propName];
        if (['desc', 'DESC'].includes(direction)) {
          // @ts-expect-error
          _this._scopeParams['order'][propName] = 'asc';
        } else if (['asc', 'ASC'].includes(direction)) {
          // @ts-expect-error
          _this._scopeParams['order'][propName] = 'desc';
        }
      });
    } else {
      // @ts-expect-error
      _this._scopeParams['order']['primaryKey'] = 'asc';
    }
    // @ts-expect-error
    _this._currentScopeFn = _this.toPromiseArray;
    return _this;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-offset
   */
  offset<T extends ActiveRecord$Base>(value: number): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    _this._scopeParams['offset'] = value;
    // @ts-expect-error
    _this._currentScopeFn = _this.toPromiseArray;
    return _this;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-limit
   */
  limit<T extends ActiveRecord$Base>(value: number): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    _this._scopeParams['limit'] = value;
    // @ts-expect-error
    _this._currentScopeFn = _this.toPromiseArray;
    return _this;
  }

  /**
   * @description Behavior is different from rails group
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-group
   */
  group<T extends ActiveRecord$Base, U = { [key: string]: any }>(
    ...props: Array<keyof U>
  ): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    _this._scopeParams['group'] = props;
    // @ts-expect-error
    _this._currentScopeFn = _this.toPromiseArray;
    return _this;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-unscope
   */
  unscope<T extends ActiveRecord$Base>(
    ...scopeMethods: t.ScopeMethods[]
  ): ActiveRecord$Relation<T> {
    const { SCOPE_METHODS } = ActiveRecord$QueryMethods;
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    if (scopeMethods.length === 0) {
      throw errObj({
        code: ErrCodes.ARGUMENT_IS_INVALID,
        message: `'unscope()' must contain arguments.`,
      });
    } else if (isSuperset(SCOPE_METHODS, scopeMethods)) {
      scopeMethods.forEach((scopeMethod) => {
        // @ts-expect-error
        _this._scopeParams[scopeMethod] = Object.assign(
          {},
          // @ts-expect-error
          JSON.parse(JSON.stringify(_this._defaultScopeParams[scopeMethod]))
        );
      });
    } else {
      throw errObj({
        code: ErrCodes.ARGUMENT_IS_INVALID,
        message: `Called 'unscope()' with invalid unscoping argument '[${scopeMethods}]'. Valid arguments are '[${SCOPE_METHODS}]'.`,
      });
    }

    return _this;
  }

  /**
   * The record itself may have been updated by the time of evaluation, so it is being reacquired.
   */
  toPromiseArray<T extends ActiveRecord$Base>(): Promise<T[] | { [key: string]: T[] }> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    return _this.recordKlass.all<T>().then((newRelation: ActiveRecord$Relation<T>) => {
      // @ts-expect-error
      const evaluator = new Evaluator<T, { [key: string]: any }>(newRelation, _this._scopeParams);
      evaluator.all();

      if (evaluator.isGroupedRecords()) {
        // @ts-expect-error
        return newRelation._groupedRecords;
      } else {
        // @ts-expect-error
        return newRelation.records;
      }
    });
  }

  /**
   * @alias toPromiseArray
   */
  toPA<T extends ActiveRecord$Base>(): Promise<T[] | { [key: string]: T[] }> {
    return this.toPromiseArray<T>();
  }
}

function isPresent(params: any): boolean {
  if (typeof params === 'number') {
    return params !== 0;
  } else if (Array.isArray(params)) {
    return params.length > 0;
  } else {
    return params && Object.keys(params).length > 0;
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
