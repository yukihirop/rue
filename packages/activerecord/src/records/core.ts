// local
import { cacheForRecords as Cache } from '@/registries';
import { Filter$WhereChain } from '@/filters';
import { Impl } from './impl';

// types
import type * as t from './types';
import type * as ft from '@/filters';

export const RECORD_AUTO_INCREMENNT_ID = Impl['RECORD_AUTO_INCREMENNT_ID'];
export const RECORD_ALL = Impl['RECORD_ALL'];
export const RECORD_ID = Impl['RECORD_ID'];

export class Core extends Impl {
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
