import { RueModule } from '@ruejs/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';
import { ErrCodes, errObj } from '@/errors';
import { isPresent, isSuperset } from '@/utils';

// types
import type * as t from './types';

// this is bound to an instance(class) of ActiveRecord$Relation (include runtime class)
export class ActiveRecord$QueryMethods extends RueModule {
  static SCOPE_METHODS = ['where', 'order', 'offset', 'limit', 'group'];

  /**
   * Records cannot be created correctly without lazy evaluation
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-where
   */
  where<T extends ActiveRecord$Base, U>(params: Partial<U>): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    _this.superThen(({ holder }) => {
      Object.assign(holder.scopeParams['where'], params || {});
    });

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
    _this.superThen(({ holder }) => {
      holder.scopeParams['where'] = params || {};
    });

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
    _this.superThen(({ holder }) => {
      Object.assign(holder.scopeParams['order'], params || {});
    });

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
    _this.superThen(({ holder }) => {
      // @ts-expect-error
      holder.scopeParams['order'] = params || {};
    });

    return _this;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-reverse_order
   */
  reverseOrder<T extends ActiveRecord$Base>(): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    _this.superThen(({ holder }) => {
      const orderParams = holder.scopeParams['order'];
      if (isPresent(orderParams)) {
        Object.keys(orderParams).forEach((propName) => {
          const direction = orderParams[propName];
          if (['desc', 'DESC'].includes(direction)) {
            holder.scopeParams['order'][propName] = 'asc';
          } else if (['asc', 'ASC'].includes(direction)) {
            holder.scopeParams['order'][propName] = 'desc';
          }
        });
      } else {
        holder.scopeParams['order']['id'] = 'asc';
      }
    });

    return _this;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-offset
   */
  offset<T extends ActiveRecord$Base>(value: number): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    _this.superThen(({ holder }) => {
      holder.scopeParams['offset'] = value;
    });

    return _this;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-limit
   */
  limit<T extends ActiveRecord$Base>(value: number): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    _this.superThen(({ holder }) => {
      holder.scopeParams['limit'] = value;
    });

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
    _this.superThen(({ holder }) => {
      // @ts-expect-error
      holder.scopeParams['group'] = props;
    });

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
    // @ts-expect-error
    _this.superThen(({ holder }) => {
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

    return _this;
  }
}
