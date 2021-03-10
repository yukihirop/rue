// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';
import { ErrCodes, errObj } from '@/errors';

import type * as t from './types';

export class ActiveRecord$QueryMethods$Evaluator<T extends ActiveRecord$Base, U> {
  private relation: ActiveRecord$Relation<T>;
  private scopeParams: t.ScopeParams<U>;

  constructor(relation: ActiveRecord$Relation<T>, scopeParams: t.ScopeParams<U>) {
    this.relation = relation;
    this.scopeParams = scopeParams;
  }

  static all<U extends ActiveRecord$Base>(relation: ActiveRecord$Relation<U>) {
    // @ts-expect-error
    const scopeParams = relation._scopeParams;
    const instance = new this(relation, scopeParams);
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

    // @ts-expect-error
    const records = this.relation.records;
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
    // @ts-expect-error
    this.relation.records = result;
    return this;
  }

  order(): this {
    const orderParams = this.scopeParams['order'];
    if (!this.isPresent(orderParams)) return this;

    // @ts-expect-error
    const records = this.relation.records;
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
    // @ts-expect-error
    this.relation.records = records;
    return this;
  }

  offset(): this {
    const offsetValue = this.scopeParams['offset'];
    if (!this.isPresent(offsetValue)) return this;

    // @ts-expect-error
    const records = this.relation.records;
    // @ts-expect-error
    this.relation.records = records.slice(offsetValue, records.length);
    return this;
  }

  limit(): this {
    const limitValue = this.scopeParams['limit'];
    if (!this.isPresent(limitValue)) return this;

    // @ts-expect-error
    const records = this.relation.records;
    // @ts-expect-error
    this.relation.records = records.slice(0, limitValue);
    return this;
  }

  group(): this {
    const groupParams = this.scopeParams['group'];
    if (!this.isPresent(groupParams)) return this;

    // @ts-expect-error
    const records = this.relation.records;
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
    // @ts-expect-error
    this.relation._groupedRecords = groupedRecords;
    return this;
  }

  isGroupedRecords(): boolean {
    return (
      // @ts-expect-error
      this.isPresent(this.relation._groupedRecords) && this.isPresent(this.scopeParams['group'])
    );
  }

  private isPresent(params: any): boolean {
    if (typeof params === 'number') {
      return params !== 0;
    } else if (Array.isArray(params)) {
      return params.length > 0;
    } else {
      return params && Object.keys(params).length > 0;
    }
  }
}
