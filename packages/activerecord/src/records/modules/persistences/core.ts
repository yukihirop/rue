// rue packages
import { Model } from '@rue/activemodel';
import { Support } from '@rue/activesupport';

// locals
import { errObj, ErrCodes } from '@/errors';
import { cacheForRecords as Cache } from '@/registries';
import { Record } from '@/records';

// this is bound to an instance(class) of Record
export const Persistence = Support.defineRueModule('ActiveRecord$Persistence', {
  constant: {
    RECORD_AUTO_INCREMENNT_ID: '__rue_auto_increment_record_id__',
    RECORD_ID: '__rue_record_id__',
    RECORD_ALL: 'all',
  },

  instance: {
    save(opts?: { validate: boolean }): boolean {
      opts = opts == undefined ? { validate: true } : opts;
      if (!opts.validate || (this as Model).isValid()) {
        const klassName = this.constructor.name;
        Persistence.instance._ensureCache(klassName);

        // auto increment start
        let __record_aid__ = Cache.read<number>(
          klassName,
          Persistence.constant.RECORD_AUTO_INCREMENNT_ID,
          'value'
        );
        (this as any)[Persistence.constant.RECORD_ID] = __record_aid__;
        __record_aid__ = __record_aid__ + 1;
        Cache.update(klassName, Persistence.constant.RECORD_AUTO_INCREMENNT_ID, __record_aid__);
        // auto increment end
        Cache.create(klassName, Persistence.constant.RECORD_ALL, [this]);
        return true;
      } else {
        return false;
      }
    },

    saveOrThrow(): void | boolean {
      if ((this as Model).isValid()) {
        this.save({ validate: false });
      } else {
        throw errObj({
          code: ErrCodes.RECORD_IS_INVALID,
          params: {
            inspect: this.inspect(),
          },
        });
      }
    },

    destroy(): Record {
      const destroyThis = this;

      // auto decrement start
      const klassName = this.constructor.name;
      const allData = Cache.read<Record[]>(klassName, Persistence.constant.RECORD_ALL, 'array');
      const filteredData = allData.filter(
        (record) =>
          record[Persistence.constant.RECORD_ID] != destroyThis[Persistence.constant.RECORD_ID]
      );

      Persistence.instance._ensureCache(klassName);
      Cache.update(klassName, Persistence.constant.RECORD_ALL, filteredData);

      return destroyThis;
    },

    _ensureCache(klassName: string) {
      if (Cache.data[klassName] == undefined) Persistence.instance._resetCache(klassName);
      if (Cache.data[klassName][Persistence.constant.RECORD_AUTO_INCREMENNT_ID] == undefined)
        Persistence.instance._resetCache(klassName);
    },

    _resetCache(klassName: string) {
      Cache.destroy(klassName);
      Cache.create(klassName, Persistence.constant.RECORD_ALL, []);
      Cache.create(klassName, Persistence.constant.RECORD_AUTO_INCREMENNT_ID, 1);
    },
  },

  static: {
    destroyAll<T extends Record>(filter?: (self: T) => boolean): Array<T> {
      const klassName = this.name;
      const allData = Cache.read<T[]>(klassName, Persistence.constant.RECORD_ALL, 'array');

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
      Cache.update(klassName, Persistence.constant.RECORD_ALL, leavedData);
      return deleteData;
    },
  },
});
