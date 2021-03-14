// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation$Holder } from '@/records/relations';
import { ErrCodes, errObj } from '@/errors';

import type * as t from './types';

export class ActiveRecord$QueryMethods$Evaluator<T extends ActiveRecord$Base, U> {
  private holder: ActiveRecord$Relation$Holder<T>;
  private scopeParams: t.ScopeParams<U>;

  constructor(holder: ActiveRecord$Relation$Holder<T>, scopeParams: t.ScopeParams<U>) {
    this.holder = holder;
    this.scopeParams = scopeParams;
  }

  static all<U extends ActiveRecord$Base>(holder: ActiveRecord$Relation$Holder<U>) {
    const scopeParams = holder.scopeParams;
    const instance = new this(holder, scopeParams);
    instance.all();
  }

  all() {
    this.where()
      .order()
      .offset()
      .limit()
      /**
       * From here onward, processing of the acquired data
       */
      .group();
  }

  where(): this {
    const whereParams = this.scopeParams['where'];
    if (!this.isPresent(whereParams)) return this;

    const records = this.holder.scope;
    const result = records.reduce((acc: Array<T>, record: T) => {
      const isMatch = Object.keys(whereParams)
        .map((key: string) => {
          const val = whereParams[key];
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
    this.holder.scope = result;
    return this;
  }

  order(): this {
    const orderParams = this.scopeParams['order'];
    if (!this.isPresent(orderParams)) return this;

    const records = this.holder.scope;
    Object.keys(orderParams).forEach((propName) => {
      const direction = orderParams[propName];
      records.sort((a: T, b: T) => {
        if (['asc', 'ASC'].includes(direction)) {
          if (a[propName] < b[propName]) {
            return -1;
          } else if (a[propName] > b[propName]) {
            return 1;
          } else {
            return 0;
          }
        } else if (['desc', 'DESC'].includes(direction)) {
          if (a[propName] < b[propName]) {
            return 1;
          } else if (a[propName] > b[propName]) {
            return -1;
          } else {
            return 0;
          }
        } else {
          throw errObj({
            code: ErrCodes.DIRECTION_IS_INVALID,
            params: {
              direction,
              directionList: ['asc', 'desc', 'ASC', 'DESC'],
            },
          });
        }
      });
    });
    this.holder.scope = records;
    return this;
  }

  offset(): this {
    const offsetValue = this.scopeParams['offset'];
    if (!this.isPresent(offsetValue)) return this;

    const records = this.holder.scope;
    this.holder.scope = records.slice(offsetValue, records.length);
    return this;
  }

  limit(): this {
    const limitValue = this.scopeParams['limit'];
    if (!this.isPresent(limitValue)) return this;

    const records = this.holder.scope;
    this.holder.scope = records.slice(0, limitValue);
    return this;
  }

  group(): this {
    const groupParams = this.scopeParams['group'];
    if (!this.isPresent(groupParams)) return this;

    const records = this.holder.scope;
    let foundPairs = [];
    const groupedRecords = records.reduce((acc, record) => {
      const pairs = groupParams.reduce((propAcc, propName) => {
        propAcc.push(record[propName]);
        return propAcc;
      }, []);

      if (foundPairs.includes(`${pairs}`)) {
        acc[`[${pairs}]`].push(record);
      } else {
        foundPairs.push(`${pairs}`);
        acc[`[${pairs}]`] = [record];
      }
      return acc;
    }, {} as any);
    this.holder.groupedRecords = groupedRecords;
    return this;
  }

  isGroupedRecords(): boolean {
    return this.isPresent(this.holder.groupedRecords) && this.isPresent(this.scopeParams['group']);
  }

  private isPresent(params: any): boolean {
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
}
