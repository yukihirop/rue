import * as t from './types';

export class ActiveRecord$Filters$WhereChain<T = any> {
  private params: t.WhereParams;
  private allPromiseFn: () => Promise<T[]>;

  constructor(allPromiseFn: () => Promise<T[]>) {
    this.params = {};
    this.allPromiseFn = allPromiseFn;
  }

  // Give dummy generics(_U) to align method signatures
  where<_U = any>(params: t.WhereParams): ActiveRecord$Filters$WhereChain<T> {
    Object.assign(this.params, params);
    return this;
  }

  // Give dummy generics(_U) to align method signatures
  rewhere<_U = any>(params: t.WhereParams): ActiveRecord$Filters$WhereChain<T> {
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

  toPromiseArray(): Promise<T[]> {
    return this.allPromiseFn().then((records: T[]) => {
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
