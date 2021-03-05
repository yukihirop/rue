import { RueModule } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$QueryMethods$WhereChain } from './where_chain';

// types
import type * as wct from './where_chain';

export class ActiveRecord$QueryMethods extends RueModule {
  static where<T extends ActiveRecord$Base, U = wct.WhereParams>(
    params: Partial<U>
  ): ActiveRecord$QueryMethods$WhereChain<T> {
    // @ts-ignore
    const _this = this as typeof ActiveRecord$Base;
    // Records cannot be created correctly without lazy evaluation
    const whereChain = new ActiveRecord$QueryMethods$WhereChain<T>(() => _this.all<T>());
    return whereChain.where<U>(params);
  }

  static rewhere<T extends ActiveRecord$Base, U = wct.WhereParams>(
    params: Partial<U>
  ): ActiveRecord$QueryMethods$WhereChain<T> {
    // @ts-ignore
    const _this = this as typeof ActiveRecord$Base;
    // Records cannot be created correctly without lazy evaluation
    const whereChain = new ActiveRecord$QueryMethods$WhereChain<T>(() => _this.all<T>());
    return whereChain.rewhere<U>(params);
  }
}
