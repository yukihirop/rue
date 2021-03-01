// local
import { cacheForRecords as Cache } from '@/registries';
import { ActiveRecord$QueryMethods$WhereChain } from './modules';
import { ActiveRecord$Impl } from './impl';

// types
import type * as t from './types';
import type * as ft from './modules/query_methods';

export const RECORD_AUTO_INCREMENNT_ID = ActiveRecord$Impl['RECORD_AUTO_INCREMENNT_ID'] as string;
export const RECORD_ALL = ActiveRecord$Impl['RECORD_ALL'] as string;
export const RECORD_ID = ActiveRecord$Impl['RECORD_ID'] as string;

export class ActiveRecord$Base extends ActiveRecord$Impl {
  public errors: t.Validations$Errors;

  constructor(data: t.Params = {}) {
    super();

    (this as any)[RECORD_ID] = undefined;

    Object.keys(data).forEach((key) => {
      (this as any)[key] = data[key];
    });

    ActiveRecord$Impl.defineAssociations(this);
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

  static all<T extends ActiveRecord$Base>(): Promise<Array<T>> {
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

  static where<T extends ActiveRecord$Base>(
    params: ft.QueryMethods$WhereParams
  ): ActiveRecord$QueryMethods$WhereChain {
    const whereChain = new ActiveRecord$QueryMethods$WhereChain<T>(() => this.all<T>());
    return whereChain.where<T>(params);
  }
}
