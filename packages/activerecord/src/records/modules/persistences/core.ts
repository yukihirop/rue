// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { errObj, ErrCodes } from '@/errors';
import { cacheForRecords as Cache } from '@/registries';
import { ActiveRecord$Base } from '@/records';

// third party
import dayjs from 'dayjs';

// this is bound to an instance(class) of ActiveRecord$Base
export class ActiveRecord$Persistence extends RueModule {
  static readonly RECORD_AUTO_INCREMENNT_ID = '__rue_auto_increment_record_id__';
  static readonly RECORD_ID = '__rue_record_id__';
  static readonly RUE_CREATED_AT = '__rue_created_at__';
  static readonly RUE_UPDATED_AT = '__rue_updated_at__';
  static readonly RECORD_ALL = 'all';

  static destroyAll<T extends ActiveRecord$Base>(filter?: (self: T) => boolean): Array<T> {
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

    deleteData.forEach((record) => Object.freeze(record));
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

      const now = dayjs().format();
      _this[ActiveRecord$Persistence.RECORD_ID] = __record_aid__;
      _this[ActiveRecord$Persistence.RUE_CREATED_AT] =
        _this[ActiveRecord$Persistence.RUE_CREATED_AT] || now;
      _this[ActiveRecord$Persistence.RUE_UPDATED_AT] = now;

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

  destroy(): ActiveRecord$Base {
    const destroyThis = this as any;

    // auto decrement start
    const klassName = this.constructor.name;
    const allData = Cache.read<ActiveRecord$Base[]>(
      klassName,
      ActiveRecord$Persistence.RECORD_ALL,
      'array'
    );
    const filteredData = allData.filter(
      (record) =>
        record[ActiveRecord$Persistence.RECORD_ID] !=
        destroyThis[ActiveRecord$Persistence.RECORD_ID]
    );

    _ensureCache(klassName);
    Cache.update(klassName, ActiveRecord$Persistence.RECORD_ALL, filteredData);

    Object.freeze(destroyThis);
    return destroyThis as ActiveRecord$Base;
  }

  update<T>(params?: Partial<T>): boolean {
    const updateProps = (record: ActiveRecord$Base) => {
      Object.keys(params).forEach((key) => {
        record[key] = params[key];
      });
    };

    // @ts-ignore
    const _this = this as ActiveRecord$Base;
    const oldRecord = _clone(_this);
    updateProps(oldRecord);

    if (oldRecord.isValid()) {
      updateProps(_this);
      _this.save({ validate: false });
      return true;
    } else {
      return false;
    }
  }
}

function _clone(original: ActiveRecord$Base): ActiveRecord$Base {
  return Object.assign(Object.create(Object.getPrototypeOf(original)), original);
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
