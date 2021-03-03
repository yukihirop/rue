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

  // Give dummy generics(_U) to align method signatures
  where<_U = any>(params: t.WhereParams): ActiveRecord$QueryMethods$WhereChain<T> {
    Object.assign(this.params, params);
    return this;
  }

  // Give dummy generics(_U) to align method signatures
  rewhere<_U = any>(params: t.WhereParams): ActiveRecord$QueryMethods$WhereChain<T> {
    this.params = params;
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

  // First evaluated here
  toPromiseArray(): Promise<T[]> {
    return this.allPromiseFn().then((relation: ActiveRecord$Relation<T>) => {
      const records = relation.toA();
      const result = records.reduce((acc: Array<T>, record: T) => {
        const isMatch = Object.keys(this.params)
          .map((key: string) => {
            const val = this.params[key];
            if (Array.isArray(val)) {
              return val.includes(record[key]);
            } else {
              return (record as any)[key] === val;
            }
          })
          .every(Boolean);
        if (isMatch) acc.push(record);
        return acc;
      }, [] as Array<T>);
      return Promise.resolve(result);
    });
  }

  // alias toPromiseArray
  toPA(): Promise<T[]> {
    return this.toPromiseArray();
  }
}
