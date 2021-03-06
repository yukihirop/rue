// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { errObj, ErrCodes } from '@/errors';
import { cacheForRecords as RecordCache } from '@/registries';
import { ActiveRecord$Base } from '@/records';

// third party
import dayjs from 'dayjs';

// this is bound to an instance(class) of ActiveRecord$Base
export class ActiveRecord$Persistence extends RueModule {
  static readonly RUE_AUTO_INCREMENT_RECORD_ID = '__rue_auto_increment_record_id__';
  static readonly RUE_RECORD_ID = '__rue_record_id__';
  static readonly RUE_CREATED_AT = '__rue_created_at__';
  static readonly RUE_UPDATED_AT = '__rue_updated_at__';
  static readonly RECORD_ALL = 'all';

  static destroyAll<T extends ActiveRecord$Base>(filter?: (self: T) => boolean): Array<T> {
    const klassName = this.name;
    const allData = RecordCache.read<T[]>(klassName, ActiveRecord$Persistence.RECORD_ALL, 'array');

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
    RecordCache.update(klassName, ActiveRecord$Persistence.RECORD_ALL, leavedData);

    deleteData.forEach((record) => Object.freeze(record));
    return deleteData;
  }

  save(opts?: { validate: boolean }): boolean {
    const {
      RUE_RECORD_ID,
      RUE_AUTO_INCREMENT_RECORD_ID,
      RUE_CREATED_AT,
      RUE_UPDATED_AT,
      RECORD_ALL,
    } = ActiveRecord$Persistence;

    opts = opts == undefined ? { validate: true } : opts;
    // @ts-ignore
    const _this = this as ActiveRecord$Base;

    if (!opts.validate || _this.isValid()) {
      const klassName = this.constructor.name;
      _ensureRecordCache(klassName);

      const now = dayjs().format();
      _this[RUE_CREATED_AT] = _this[RUE_CREATED_AT] || now;
      _this[RUE_UPDATED_AT] = now;

      // do not exists record
      if (!_this[RUE_RECORD_ID]) {
        let __record_aid__ = RecordCache.read<number>(
          klassName,
          RUE_AUTO_INCREMENT_RECORD_ID,
          'value'
        );
        _this[RUE_RECORD_ID] = __record_aid__;
        __record_aid__ = __record_aid__ + 1;
        RecordCache.update(klassName, RUE_AUTO_INCREMENT_RECORD_ID, __record_aid__);
        RecordCache.create(klassName, RECORD_ALL, [this]);
      } else {
        const allRecords = RecordCache.read<ActiveRecord$Base[]>(klassName, RECORD_ALL, 'array');
        allRecords.forEach((record) => {
          if (record[RUE_RECORD_ID] === _this[RUE_RECORD_ID]) {
            // @ts-ignore
            record = this;
          }
        });
        RecordCache.update(klassName, RECORD_ALL, allRecords);
      }

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

  destroy<T extends ActiveRecord$Base>(): T {
    const destroyThis = this as any;

    const klassName = this.constructor.name;
    const allData = RecordCache.read<T[]>(klassName, ActiveRecord$Persistence.RECORD_ALL, 'array');
    const filteredData = allData.filter(
      (record) =>
        record[ActiveRecord$Persistence.RUE_RECORD_ID] !=
        destroyThis[ActiveRecord$Persistence.RUE_RECORD_ID]
    );

    _ensureRecordCache(klassName);
    RecordCache.update(klassName, ActiveRecord$Persistence.RECORD_ALL, filteredData);

    Object.freeze(destroyThis);
    return destroyThis as T;
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

function _ensureRecordCache(klassName: string) {
  if (RecordCache.data[klassName] == undefined) _resetRecordCache(klassName);
  if (
    RecordCache.data[klassName][ActiveRecord$Persistence.RUE_AUTO_INCREMENT_RECORD_ID] == undefined
  )
    _resetRecordCache(klassName);
}

function _resetRecordCache(klassName: string) {
  RecordCache.destroy(klassName);
  RecordCache.create(klassName, ActiveRecord$Persistence.RECORD_ALL, []);
  RecordCache.create(klassName, ActiveRecord$Persistence.RUE_AUTO_INCREMENT_RECORD_ID, 1);
}
