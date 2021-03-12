// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';

// types
import * as t from './types';

export class ActiveRecord$QueryMethods$WhereChain<T extends ActiveRecord$Base> {
  private params: t.WhereParams;
  private allPromiseFn: () => Promise<ActiveRecord$Relation<T>>;

  constructor(allPromiseFn: () => Promise<ActiveRecord$Relation<T>>) {
    this.params = {};
    this.allPromiseFn = allPromiseFn;
  }

  where<U>(params: Partial<U>): ActiveRecord$QueryMethods$WhereChain<T> {
    Object.assign(this.params, params);
    return this;
  }

  rewhere<U>(params: Partial<U>): ActiveRecord$QueryMethods$WhereChain<T> {
    this.params = params || {};
    return this;
  }

  inspect(): string {
    const klassName = this.constructor.name;
    let sorted = {};

    const keys = Object.keys(this).sort();
    keys.forEach(function (key) {
      sorted[key] = this[key];
    }, this);

    return `${klassName} ${JSON.stringify(sorted, null, 2)}`;
  }
}
