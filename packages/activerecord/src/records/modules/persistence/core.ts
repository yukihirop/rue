// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { errObj, ErrCodes } from '@/errors';
import { cacheForRecords as RecordCache } from '@/registries';
import { ActiveRecord$Base } from '@/records';
import { clone } from '@/utils';

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
   * Comment out because it is the same as destroySync
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-delete
   */
  protected deleteSync<T extends ActiveRecord$Base>(): T {
    return this.destroySync();
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
  protected saveSync(opts?: { validate: boolean }): boolean {
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
      const cacheKey = _this.uniqueKey;
      _ensureRecordCache(cacheKey);

      const now = dayjs().format();
      _this[RUE_CREATED_AT] = _this[RUE_CREATED_AT] || now;
      _this[RUE_UPDATED_AT] = now;

      // do not exists record
      if (!_this[RUE_RECORD_ID]) {
        let __record_aid__ = RecordCache.read<number>(
          cacheKey,
          RUE_AUTO_INCREMENT_RECORD_ID,
          'value'
        );

        _this[RUE_RECORD_ID] = __record_aid__;
        // @ts-expect-error
        _this._newRecord = false;
        __record_aid__ = __record_aid__ + 1;

        RecordCache.update(cacheKey, RUE_AUTO_INCREMENT_RECORD_ID, __record_aid__);
        RecordCache.create(cacheKey, RECORD_ALL, [this]);
      } else {
        const allRecords = RecordCache.read<ActiveRecord$Base[]>(cacheKey, RECORD_ALL, 'array');
        const updatedAllRecords = allRecords.map((record) => {
          // @ts-expect-error
          if (record[RUE_RECORD_ID] === _this[RUE_RECORD_ID]) record = this;
          return record;
        });
        RecordCache.update(cacheKey, RECORD_ALL, updatedAllRecords);
      }

      return true;
    } else {
      return false;
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-saveSync-21
   */
  protected saveSyncOrThrow(opts?: { validate: boolean }): void | boolean {
    opts = opts == undefined ? { validate: true } : opts;
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    if (!opts.validate || _this.isValid()) {
      return this.saveSync({ validate: false });
    } else {
      throw errObj({
        code: ErrCodes.RECORD_IS_INVALID,
        params: {
          inspect: _this.inspect(),
        },
      });
    }
  }

  protected destroySync<T extends ActiveRecord$Base>(): T {
    // @ts-ignore
    const _this = this as ActiveRecord$Base;
    const { RECORD_ALL, RUE_RECORD_ID } = ActiveRecord$Persistence;

    if (_this.isPersisted()) {
      const cacheKey = _this.uniqueKey;
      const allData = RecordCache.read<T[]>(cacheKey, RECORD_ALL, 'array');
      const filteredData = allData.filter(
        (record) => record[RUE_RECORD_ID] != _this[RUE_RECORD_ID]
      );

      _ensureRecordCache(cacheKey);
      RecordCache.update(cacheKey, RECORD_ALL, filteredData);
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
  protected updateSync<T>(params?: Partial<T>): boolean {
    const updateProps = (record: ActiveRecord$Base) => {
      Object.keys(params).forEach((key) => {
        record[key] = params[key];
      });
    };

    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    const oldRecord = clone<ActiveRecord$Base>(_this);
    updateProps(oldRecord);

    if (oldRecord.isValid()) {
      updateProps(_this);
      // @ts-expect-error
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
  protected updateSyncOrThrow<T>(params?: Partial<T>): boolean {
    const updateProps = (record: ActiveRecord$Base) => {
      Object.keys(params).forEach((key) => {
        record[key] = params[key];
      });
    };

    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    const oldRecord = clone<ActiveRecord$Base>(_this);
    updateProps(oldRecord);

    if (oldRecord.isValid()) {
      updateProps(_this);
      // @ts-expect-error
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
      // @ts-expect-error
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
  protected static createSync<T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): T | T[] {
    if (Array.isArray(params)) {
      return params.map((param) => this.createSync<T, U>(param as Partial<U>, yielder) as T);
    } else {
      // @ts-expect-error
      const _this = this as ct.Constructor<T>;
      const record = new _this(params);
      if (yielder) yielder(record);
      // @ts-expect-error
      record.saveSync();
      return record;
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-create-21
   */
  protected static createSyncOrThrow<T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): T | T[] {
    if (Array.isArray(params)) {
      return params.map((param) => this.createSyncOrThrow<T, U>(param as Partial<U>, yielder) as T);
    } else {
      // @ts-expect-error
      const _this = this as ct.Constructor<T>;
      const record = new _this(params);
      if (yielder) yielder(record);
      // @ts-expect-error
      record.saveSyncOrThrow();
      return record;
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-delete
   */
  protected static deleteSync<T extends ActiveRecord$Base>(
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
  protected static destroySync<T extends ActiveRecord$Base>(
    id: at.Associations$PrimaryKey | at.Associations$PrimaryKey[]
  ): T | T[] {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    if (Array.isArray(id)) {
      // @ts-expect-error
      return (_this.find<T>(...id) as T[]).map((r) => r.destroySync());
    } else {
      // @ts-expect-error
      return (_this.find<T>(id) as T).destroySync();
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-update
   */
  protected static updateSync<T extends ActiveRecord$Base, U>(
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
        // @ts-expect-error
        record.updateSync(params);
        return record;
      });
    } else if (ids.length === 1) {
      const record = _this.find<T>(ids[0]) as T;
      // @ts-expect-error
      record.updateSync(params);
      updatedRecords = [record];
    } else {
      updatedRecords = ids.map((id, index) => {
        const record = _this.find<T>(id) as T;
        // @ts-expect-error
        record.updateSync(params[index]);
        return record;
      });
    }

    if (updatedRecords.length === 1) {
      return updatedRecords[0];
    } else {
      return updatedRecords;
    }
  }

  /**
   * Please override to hit the external API.
   */
  save(opts?: { validate: boolean }): Promise<boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    // @ts-expect-error
    return Promise.resolve(_this.saveSync(opts));
  }
  /**
   * Please override to hit the external API.
   */
  saveOrThrow(opts?: { validate: boolean }): Promise<void | boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    try {
      // @ts-expect-error
      const result = _this.saveSyncOrThrow(opts);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  /**
   * Please override to hit the external API.
   */
  destroy<T extends ActiveRecord$Base>(): Promise<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    // @ts-expect-error
    return Promise.resolve(_this.destroySync<T>());
  }
  /**
   * Please override to hit the external API.
   */
  update<U>(params?: Partial<U>): Promise<boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    // @ts-expect-error
    return Promise.resolve(_this.updateSync(params));
  }
  /**
   * Please override to hit the external API.
   */
  updateOrThrow<U>(params?: Partial<U>): Promise<boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    try {
      // @ts-expect-error
      const result = _this.updateSyncOrThrow(params);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.resolve(err);
    }
  }
  /**
   * Please override to hit the external API.
   */
  static create<T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    // @ts-expect-error
    return Promise.resolve(_this.createSync(params, yielder));
  }
  /**
   * Please override to hit the external API.
   */
  static createOrThrow<T extends ActiveRecord$Base, U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    try {
      // @ts-expect-error
      const result = _this.createSyncOrThrow(params, yielder);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Please override to hit the external API.
   */
  static delete<T extends ActiveRecord$Base>(
    id: at.Associations$PrimaryKey | at.Associations$PrimaryKey[]
  ): Promise<number> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    // @ts-expect-error
    return Promise.resolve(_this.deleteSync(id));
  }

  /**
   * Please override to hit the external API.
   */
  static destroy<T extends ActiveRecord$Base>(
    id: at.Associations$PrimaryKey | at.Associations$PrimaryKey[]
  ): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    // @ts-expect-error
    return Promise.resolve(_this.destroySync<T>(id));
  }

  /**
   * Please override to hit the external API.
   */
  static update<T extends ActiveRecord$Base, U>(
    id: at.Associations$PrimaryKey | at.Associations$PrimaryKey[] | 'all',
    params: Partial<U> | Array<Partial<U>>
  ): Promise<T | T[]> {
    // @ts-expect-error
    const _this = this as typeof ActiveRecord$Base;
    // @ts-expect-error
    return Promise.resolve(_this.updateSync<T, U>(id, params));
  }
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
