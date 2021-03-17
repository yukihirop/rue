// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { errObj, ErrCodes } from '@/errors';
import { cacheForRecords as RecordCache } from '@/registries';
import { ActiveRecord$Base } from '@/records';

// third party
import dayjs from 'dayjs';

// types
import type * as ct from '@/types';
import type * as at from '@/records/modules/associations';

// this is bound to an instance(class) of ActiveRecord$Base
export class ActiveRecord$Persistence extends RueModule {
  static readonly RUE_AUTO_INCREMENT_RECORD_ID = '__rue_auto_increment_record_id__';
  static readonly RUE_RECORD_ID = '__rue_record_id__';
  static readonly RUE_CREATED_AT = '__rue_created_at__';
  static readonly RUE_UPDATED_AT = '__rue_updated_at__';
  static readonly RECORD_ALL = 'all';

  /**
   * It's the same now because there is no beforeDestroy callback
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-delete
   */
  delete<T extends ActiveRecord$Base>(): T {
    return this.destroy();
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-new_record-3F
   */
  isNewRecord(): boolean {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    // @ts-expect-error
    return _this._newRecord;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-persisted-3F
   */
  isPersisted(): boolean {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    // @ts-expect-error
    return !(_this._newRecord || _this._destroyed);
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-persisted-3F
   */
  saveSync(opts?: { validate: boolean }): boolean {
    const {
      RUE_RECORD_ID,
      RUE_AUTO_INCREMENT_RECORD_ID,
      RUE_CREATED_AT,
      RUE_UPDATED_AT,
      RECORD_ALL,
    } = ActiveRecord$Persistence;

    opts = opts == undefined ? { validate: true } : opts;
    // @ts-expect-error
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
        // @ts-expect-error
        _this._newRecord = false;
        __record_aid__ = __record_aid__ + 1;

        RecordCache.update(klassName, RUE_AUTO_INCREMENT_RECORD_ID, __record_aid__);
        RecordCache.create(klassName, RECORD_ALL, [this]);
      } else {
        const allRecords = RecordCache.read<ActiveRecord$Base[]>(klassName, RECORD_ALL, 'array');

        allRecords.forEach((record) => {
          if (record[RUE_RECORD_ID] === _this[RUE_RECORD_ID]) {
            // @ts-expect-error
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

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-saveSync-21
   */
  saveSyncOrThrow(): void | boolean {
    const _this = this as any;
    if (_this.isValid()) {
      this.saveSync({ validate: false });
    } else {
      throw errObj({
        code: ErrCodes.RECORD_IS_INVALID,
        params: {
          inspect: _this.inspect(),
        },
      });
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-destroy
   */
  destroy<T extends ActiveRecord$Base>(): T {
    // @ts-ignore
    const _this = this as ActiveRecord$Base;
    const { RECORD_ALL, RUE_RECORD_ID } = ActiveRecord$Persistence;

    if (_this.isPersisted()) {
      const klassName = this.constructor.name;
      const allData = RecordCache.read<T[]>(klassName, RECORD_ALL, 'array');
      const filteredData = allData.filter(
        (record) => record[RUE_RECORD_ID] != _this[RUE_RECORD_ID]
      );

      _ensureRecordCache(klassName);
      RecordCache.update(klassName, RECORD_ALL, filteredData);
    }

    // @ts-expect-error
    _this._destroyed = true;
    Object.freeze(_this);
    return _this as T;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-destroyed-3F
   */
  isDestroyed(): boolean {
    const _this = this as any;
    return !!_this._destroyed;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-destroyed-3F
   */
  touch(opts?: { withCreatedAt?: boolean; time?: string }): boolean {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    const { RUE_CREATED_AT, RUE_UPDATED_AT } = ActiveRecord$Persistence;

    const updateProps =
      opts && opts.withCreatedAt ? [RUE_CREATED_AT, RUE_UPDATED_AT] : [RUE_UPDATED_AT];
    const datetime = opts && opts.time ? dayjs(opts.time).format() : dayjs().format();

    const result = updateProps.map((timestamp) => _this.update({ [timestamp]: datetime }));

    return result.every(Boolean);
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-update
   */
  update<T>(params?: Partial<T>): boolean {
    const updateProps = (record: ActiveRecord$Base) => {
      Object.keys(params).forEach((key) => {
        record[key] = params[key];
      });
    };

    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    const oldRecord = _clone(_this);
    updateProps(oldRecord);

    if (oldRecord.isValid()) {
      updateProps(_this);
      _this.saveSync({ validate: false });
      return true;
    } else {
      _this.errors = oldRecord.errors;
      return false;
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-update-21
   */
  updateOrThrow<T>(params?: Partial<T>): boolean {
    const updateProps = (record: ActiveRecord$Base) => {
      Object.keys(params).forEach((key) => {
        record[key] = params[key];
      });
    };

    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    const oldRecord = _clone(_this);
    updateProps(oldRecord);

    if (oldRecord.isValid()) {
      updateProps(_this);
      return _this.saveSync({ validate: false });
    } else {
      throw errObj({
        code: ErrCodes.RECORD_IS_INVALID,
        params: {
          inspect: oldRecord.inspect(),
        },
      });
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-update_attribute
   */
  updateAttribute<T extends ActiveRecord$Base>(name: string, value: any): boolean {
    // @ts-expect-error
    const _this = this as T;
    if (_this.hasOwnProperty(name)) {
      _this[name] = value;
      return _this.saveSync({ validate: false });
    } else {
      return false;
    }
  }

  /**
   * @alias updateAttribute
   */
  updateProperty<T extends ActiveRecord$Base>(name: string, value: any): boolean {
    return this.updateAttribute<T>(name, value);
  }

  /**
   * @alias updateAttribute
   */
  updateProp<T extends ActiveRecord$Base>(name: string, value: any): boolean {
    return this.updateAttribute<T>(name, value);
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-create
   */
  static create<T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): T | T[] {
    if (Array.isArray(params)) {
      return params.map((param) => this.create<T, U>(param as Partial<U>, yielder) as T);
    } else {
      // @ts-expect-error
      const _this = this as ct.Constructor<T>;
      const record = new _this(params);
      if (yielder) yielder(record);
      record.saveSync();
      return record;
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-create-21
   */
  static createOrThrow<T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): T | T[] {
    if (Array.isArray(params)) {
      return params.map((param) => this.createOrThrow<T, U>(param as Partial<U>, yielder) as T);
    } else {
      // @ts-expect-error
      const _this = this as ct.Constructor<T>;
      const record = new _this(params);
      if (yielder) yielder(record);
      record.saveSyncOrThrow();
      return record;
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-delete
   */
  static delete<T extends ActiveRecord$Base>(
    id: at.Associations$PrimaryKey | at.Associations$PrimaryKey[]
  ): number {
    const { RECORD_ALL } = ActiveRecord$Persistence;
    const ids = Array.isArray(id) ? id : [id];
    const klassName = this.name;
    const allData = RecordCache.read<T[]>(klassName, RECORD_ALL, 'array');
    const allDataLen = allData.length;
    const filteredData = allData.filter((record) => !ids.includes(record.id));
    const filteredDataLen = filteredData.length;

    _ensureRecordCache(klassName);
    RecordCache.update(klassName, RECORD_ALL, filteredData);

    return allDataLen - filteredDataLen;
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-destroy
   */
  static destroy<T extends ActiveRecord$Base>(
    id: at.Associations$PrimaryKey | at.Associations$PrimaryKey[]
  ): T | T[] {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    if (Array.isArray(id)) {
      return (_this.find<T>(...id) as T[]).map((r) => r.destroy());
    } else {
      return (_this.find<T>(id) as T).destroy();
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-update
   */
  static update<T extends ActiveRecord$Base, U>(
    id: at.Associations$PrimaryKey | at.Associations$PrimaryKey[] | 'all',
    params: Partial<U> | Array<Partial<U>>
  ): T | T[] {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    const ids = Array.isArray(id) ? id : [id];
    let updatedRecords;

    if (ids.length === 1 && ids[0] === 'all') {
      const { RECORD_ALL } = ActiveRecord$Persistence;
      const allRecords = RecordCache.read<T[]>(this.name, RECORD_ALL, 'array');
      updatedRecords = allRecords.map((record) => {
        record.update(params);
        return record;
      });
    } else if (ids.length === 1) {
      const record = _this.find<T>(ids[0]) as T;
      record.update(params);
      updatedRecords = [record];
    } else {
      updatedRecords = ids.map((id, index) => {
        const record = _this.find<T>(id) as T;
        record.update(params[index]);
        return record;
      });
    }

    if (updatedRecords.length === 1) {
      return updatedRecords[0];
    } else {
      return updatedRecords;
    }
  }
}

function _clone(original: ActiveRecord$Base): ActiveRecord$Base {
  return Object.assign(Object.create(Object.getPrototypeOf(original)), original);
}

function _ensureRecordCache(klassName: string) {
  const { RUE_AUTO_INCREMENT_RECORD_ID } = ActiveRecord$Persistence;
  if (RecordCache.data[klassName] == undefined) _resetRecordCache(klassName);
  if (RecordCache.data[klassName][RUE_AUTO_INCREMENT_RECORD_ID] == undefined)
    _resetRecordCache(klassName);
}

function _resetRecordCache(klassName: string) {
  const { RECORD_ALL, RUE_AUTO_INCREMENT_RECORD_ID } = ActiveRecord$Persistence;
  RecordCache.destroy(klassName);
  RecordCache.create(klassName, RECORD_ALL, []);
  RecordCache.create(klassName, RUE_AUTO_INCREMENT_RECORD_ID, 1);
}
