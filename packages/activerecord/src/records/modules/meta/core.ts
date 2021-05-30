// rue packages
import { RueModule } from '@ruejs/activesupport';
import { cacheForRecords as RecordCache } from '@/registries';
import {
  ActiveRecord$Base,
  RECORD_ALL,
  RUE_AUTO_INCREMENT_RECORD_ID,
  RECORD_META,
} from '@/records/base';
import { clone } from '@/utils';

import type * as ct from '@/types';

export class ActiveRecord$Meta extends RueModule {
  static meta<T>(): Promise<T> {
    // @ts-expect-error
    const _this = this as ct.Constructor<T>;
    // @ts-expect-error
    const cacheKey = _this.uniqueKey;
    const data = RecordCache.read<T>(cacheKey, RECORD_META, 'object');
    if (Object.keys(data).length !== 0) {
      return Promise.resolve(data);
    } else {
      // @ts-expect-error
      return _this.fetchAll().then((data: { all?: any[]; meta: T[] }) => {
        const result = data.meta || {};
        RecordCache.create(cacheKey, RECORD_META, result);
        return result;
      });
    }
  }

  /**
   * @see https://github.com/yukihirop/rue/issues/121#issue-906447857
   */
  static recordsWithMeta<T extends ActiveRecord$Base, U>(): Promise<[T[], U]> {
    // @ts-expect-error
    const _this = this as ct.Constructor<T>;
    // @ts-expect-error
    const cacheKey = _this.uniqueKey;

    const aid = RecordCache.read<number>(cacheKey, RUE_AUTO_INCREMENT_RECORD_ID, 'value');
    if (aid != 1 && aid != undefined) {
      const records = RecordCache.read<T[]>(cacheKey, RECORD_ALL, 'array');
      const meta = RecordCache.read<U>(cacheKey, RECORD_META, 'object');
      return Promise.resolve([records, meta]);
    } else {
      // fetchAll is defined in ActiveRecord$Base but is protected so I get a typescript error.
      // @ts-expect-error
      return _this.fetchAll().then((data) => {
        let allData, metaData;

        if (Array.isArray(data)) {
          allData = data;
          metaData = {};
        } else {
          allData = data.all || [];
          metaData = data.meta || {};
        }

        const records = allData.map((d) => {
          const record = new _this(d);

          /**
           * I use saveSync because it saves to memory.
           */
          // @ts-expect-error
          record.saveSync();

          return clone(record);
        }) as Array<T>;

        /**
         * Save meta data
         * When getting the record list, the incidental information is automatically saved so that the request does not fly to the backend unnecessarily.
         * The opposite is difficult to understand, so I won't do it.
         */
        RecordCache.create(cacheKey, RECORD_META, metaData);

        return Promise.resolve([records, metaData]);
      });
    }
  }
}
