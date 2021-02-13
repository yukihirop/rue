// local
import { ErrCodes, errObj } from '@/errors';
import { Association } from '@/associations';
import { cacheForRecords as Cache } from '@/registries';
import { Filter$WhereChain } from '@/filters';

// types
import type * as t from './types';
import type * as ft from '@/filters';

export const RECORD_AUTO_INCREMENNT_ID = '__rue_auto_increment_record_id__';
export const RECORD_ID = '__rue_record_id__';
export const RECORD_ALL = 'all';

export class Core extends Association {
  public errors: t.Validation$Errors;

  private static whereChain: Filter$WhereChain<Core>;

  constructor(data: t.Params = {}) {
    super();

    (this as any)[RECORD_ID] = undefined;

    Object.keys(data).forEach((key) => {
      (this as any)[key] = data[key];
    });

    this.defineAssociations();
  }

  // override
  static objType(): t.ObjType {
    return 'record';
  }

  protected static fetchAll<T = any>(): Promise<Array<T>> {
    throw "Please implement '[static] fetchAll' in Inherited Class";
  }

  static resetCache() {
    const klassName = this.name;
    Cache.destroy(klassName);
    Cache.create(klassName, RECORD_ALL, []);
    Cache.create(klassName, RECORD_AUTO_INCREMENNT_ID, 1);
  }

  static all<T extends Core>(): Promise<Array<T>> {
    const klassName = this.name;

    if (Cache.read<T[]>(klassName, RECORD_ALL, 'array').length > 0) {
      return Promise.resolve(Cache.read<T[]>(klassName, RECORD_ALL, 'array'));
    } else {
      return new Promise((resolve, reject) => {
        this.fetchAll<T>()
          .then((data) => {
            const records = data.map((d) => {
              const record = new this(d);

              record.save();

              return record;
            }) as Array<T>;

            return resolve(records);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  }

  static where<T extends Core>(params: ft.Filter$WhereParams): Filter$WhereChain {
    if (this.whereChain == undefined) {
      this.whereChain = new Filter$WhereChain<T>(() => this.all<T>());
    }

    this.whereChain.where<T>(params);
    return this.whereChain;
  }

  static findBy<T extends Core>(params: { [key: string]: any }): Promise<T> {
    return this.where<T>(params)
      .toPromiseArray()
      .then((records) => {
        if (records.length > 0) {
          return Promise.resolve(records[0]);
        } else {
          return Promise.reject(undefined);
        }
      });
  }

  static destroyAll<T extends Core = any>(filter?: (self: T) => boolean): Array<T> {
    const klassName = this.name;
    const allData = Cache.read<T[]>(klassName, RECORD_ALL, 'array');

    let leavedData = [];
    let deleteData = [];
    allData.forEach((record) => {
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
    Cache.update(klassName, RECORD_ALL, leavedData);
    return deleteData;
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

  save(opts?: { validate: boolean }): boolean {
    opts = opts == undefined ? { validate: true } : opts;
    if (!opts.validate || this.isValid()) {
      // auto increment start
      this.ensureCache();

      const klassName = this.constructor.name;
      let __record_aid__ = Cache.read<number>(klassName, RECORD_AUTO_INCREMENNT_ID, 'value');

      (this as any)[RECORD_ID] = __record_aid__;
      __record_aid__ = __record_aid__ + 1;
      Cache.update(klassName, RECORD_AUTO_INCREMENNT_ID, __record_aid__);
      // auto increment end

      Cache.create(klassName, RECORD_ALL, [this]);
      return true;
    } else {
      return false;
    }
  }

  saveOrThrow(): void | boolean {
    if (this.isValid()) {
      this.save({ validate: false });
    } else {
      throw errObj({
        code: ErrCodes.RECORD_IS_INVALID,
        params: {
          inspect: this.inspect(),
        },
      });
    }
  }

  destroy() {
    const destroyThis = this;

    // auto decrement start
    const klassName = this.constructor.name;
    const allData = Cache.read<this[]>(klassName, RECORD_ALL, 'value');
    const filteredData = allData.filter((record) => record[RECORD_ID] != destroyThis[RECORD_ID]);

    this.ensureCache();
    Cache.update(klassName, RECORD_ALL, filteredData);

    return destroyThis;
  }

  private ensureCache() {
    if (Cache.data[this.constructor.name] == undefined) this.resetCache();
    if (Cache.data[this.constructor.name][RECORD_AUTO_INCREMENNT_ID] == undefined)
      this.resetCache();
  }

  private resetCache() {
    const klassName = this.constructor.name;
    Cache.destroy(klassName);
    Cache.create(klassName, RECORD_ALL, []);
    Cache.create(klassName, RECORD_AUTO_INCREMENNT_ID, 1);
  }
}
