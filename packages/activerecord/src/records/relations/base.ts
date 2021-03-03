import { cacheForRecords as Cache } from '@/registries';
import { ActiveRecord$Base, RECORD_ALL } from '@/records/base';

// types
import type * as ct from '@/types';

export class ActiveRecord$Relation$Base<T extends ActiveRecord$Base> {
  private recordKlass: ct.Constructor<T>;
  private records: T[];

  constructor(recordKlass: ct.Constructor<T>, records: T[]) {
    this.recordKlass = recordKlass;
    this.records = records;
  }

  create<U>(params: U): ct.Constructor<T> {
    // @ts-ignore
    return new this.recordKlass(params);
  }

  destroyAll(filter?: (self: T) => boolean): Array<T> {
    let leavedData = [];
    let deleteData = [];
    // @ts-ignore
    this.records.forEach((record) => {
      if (filter) {
        if (filter(record)) {
          deleteData.push(record);
        } else {
          leavedData.push(record);
        }
      } else {
        deleteData.push(record);
      }
    });

    const klassName = this.constructor.name;
    Cache.update(klassName, RECORD_ALL, leavedData);
    return deleteData;
  }

  toArray(): T[] {
    return this.records;
  }

  // @alias
  toA(): T[] {
    return this.records;
  }
}
