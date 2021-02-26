// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { errObj, ErrCodes } from '@/errors';
import { cacheForRecords as Cache } from '@/registries';
import { Record } from '@/records';

// this is bound to an instance(class) of Record
export class ActiveRecord$Persistence extends RueModule {
  static RECORD_AUTO_INCREMENNT_ID = '__rue_auto_increment_record_id__';
  static RECORD_ID = '__rue_record_id__';
  static RECORD_ALL = 'all';

  static destroyAll<T extends Record>(filter?: (self: T) => boolean): Array<T> {
    const klassName = this.name;
    const allData = Cache.read<T[]>(klassName, ActiveRecord$Persistence.RECORD_ALL, 'array');

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
    Cache.update(klassName, ActiveRecord$Persistence.RECORD_ALL, leavedData);
    return deleteData;
  }

  save(opts?: { validate: boolean }): boolean {
    opts = opts == undefined ? { validate: true } : opts;
    const _this = this as any;

    if (!opts.validate || _this.isValid()) {
      const klassName = this.constructor.name;
      _ensureCache(klassName);

      // auto increment start
      let __record_aid__ = Cache.read<number>(
        klassName,
        ActiveRecord$Persistence.RECORD_AUTO_INCREMENNT_ID,
        'value'
      );
      _this[ActiveRecord$Persistence.RECORD_ID] = __record_aid__;
      __record_aid__ = __record_aid__ + 1;
      Cache.update(klassName, ActiveRecord$Persistence.RECORD_AUTO_INCREMENNT_ID, __record_aid__);
      // auto increment end
      Cache.create(klassName, ActiveRecord$Persistence.RECORD_ALL, [this]);
      return true;
    } else {
      return false;
    }
  }

  saveOrThrow(): void | boolean {
    const _this = this as any;
    if (_this.isValid()) {
      this.save({ validate: false });
    } else {
      throw errObj({
        code: ErrCodes.RECORD_IS_INVALID,
        params: {
          inspect: _this.inspect(),
        },
      });
    }
  }

  destroy(): Record {
    const destroyThis = this as any;

    // auto decrement start
    const klassName = this.constructor.name;
    const allData = Cache.read<Record[]>(klassName, ActiveRecord$Persistence.RECORD_ALL, 'array');
    const filteredData = allData.filter(
      (record) =>
        record[ActiveRecord$Persistence.RECORD_ID] !=
        destroyThis[ActiveRecord$Persistence.RECORD_ID]
    );

    _ensureCache(klassName);
    Cache.update(klassName, ActiveRecord$Persistence.RECORD_ALL, filteredData);

    return destroyThis as Record;
  }
}

function _ensureCache(klassName: string) {
  if (Cache.data[klassName] == undefined) _resetCache(klassName);
  if (Cache.data[klassName][ActiveRecord$Persistence.RECORD_AUTO_INCREMENNT_ID] == undefined)
    _resetCache(klassName);
}

function _resetCache(klassName: string) {
  Cache.destroy(klassName);
  Cache.create(klassName, ActiveRecord$Persistence.RECORD_ALL, []);
  Cache.create(klassName, ActiveRecord$Persistence.RECORD_AUTO_INCREMENNT_ID, 1);
}
