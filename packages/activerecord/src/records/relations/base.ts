// locals
import { errObj, ErrCodes } from '@/errors';
import { ActiveRecord$Base, RECORD_ALL, RUE_CREATED_AT, RUE_UPDATED_AT } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';
import { ActiveRecord$Relation$Impl } from './impl';
import { ActiveRecord$QueryMethods$Evaluator as Evaluator } from './modules/query_methods';

// third party
import dayjs from 'dayjs';

// types
import type * as ct from '@/types';
import type * as mt from './modules';

export class ActiveRecord$Relation$Base<
  T extends ActiveRecord$Base
> extends ActiveRecord$Relation$Impl<T> {
  private recordKlass: ct.Constructor<T>;
  private records: T[];
  private _scopeParams: {
    where: { [key: string]: any };
    order: { [key: string]: mt.QueryMethods$Directions };
    offset: number;
    limit: number;
    group: string[];
  };
  private _defaultScopeParams: any;
  private _groupedRecords: { [key: string]: T[] };
  private _currentScopeFn?: () => Promise<T[]>;

  constructor(recordKlass: ct.Constructor<T>, records: T[]) {
    super();
    this.recordKlass = recordKlass;
    this.records = records || [];
    this._defaultScopeParams = {
      where: {},
      order: {},
      offset: 0,
      limit: 0,
      group: [],
    };
    Object.freeze(this._defaultScopeParams);
    // Must be passed by value
    this._scopeParams = Object.assign({}, JSON.parse(JSON.stringify(this._defaultScopeParams)));
    this._groupedRecords = {};
    // Once the QueryMethods method is called, it is no longer undefined.
    this._currentScopeFn = undefined;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-many-3F
   */
  isMany(filter?: (record: T) => boolean): boolean {
    return this.records.filter(filter || Boolean).length > 1;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-none-3F
   */
  isNone(filter?: (record: T) => boolean): boolean {
    return this.records.filter(filter || Boolean).length === 0;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-one-3F
   */
  isOne(filter?: (record: T) => boolean): boolean {
    return this.records.filter(filter || Boolean).length === 1;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-any-3F
   */
  isAny(filter?: (record: T) => boolean): boolean {
    return this.records.filter(filter || Boolean).length > 0;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-blank-3F
   */
  isBlank(): boolean {
    return this.records.length == 0;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-build
   */
  build<U>(params?: Partial<U>, yielder?: (self: T) => void): T {
    // @ts-ignore
    const record = new this.recordKlass(params);
    if (yielder) yielder(record);
    return record;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-create
   * @todo Support yielder
   */
  create<U>(params?: Partial<U>): T {
    // @ts-ignore
    const record = new this.recordKlass(params);
    record.save();
    this.records.push(record);
    return record;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-create-21
   * @todo Support yielder
   */
  createOrThrow<U>(params?: Partial<U>): T {
    // @ts-ignore
    const record = new this.recordKlass(params);

    if (record.save()) {
      this.records.push(record);
      return record;
    } else {
      throw errObj({
        code: ErrCodes.RECORD_IS_INVALID,
        params: {
          inspect: record.inspect(),
        },
      });
    }
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-create_or_find_by
   * @todo Support yielder
   */
  createOrFindBy<U>(params: Partial<U>): Promise<T> {
    // @ts-ignore
    return (this.recordKlass as typeof ActiveRecord$Base).findBy(params).then((record) => {
      if (record) {
        return record;
      } else {
        const createdRecord = this.create<Partial<U>>(params);
        return createdRecord;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-create_or_find_by-21
   * @todo Support yielder
   */
  createOrFindByOrThrow<U>(params: Partial<U>): Promise<T> {
    // @ts-ignore
    return (this.recordKlass as typeof ActiveRecord$Base).findBy<T, U>(params).then((record) => {
      if (record) {
        return record;
      } else {
        const record = this.createOrThrow<U>(params);
        return record;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-delete_by
   */
  deleteBy<U>(params?: Partial<U>): Promise<number> {
    const deleteRecordFn = (record: T) => {
      record.destroy();
      return true;
    };

    return (
      this.recordKlass
        // @ts-ignore
        .where<T, U>(params)
        .then((relation) => {
          const records = relation.toA();
          return Promise.all(records.map(deleteRecordFn)).then((result) => {
            this.records = RecordCache.read(this.recordKlass.name, RECORD_ALL, 'array');
            return result.filter(Boolean).length;
          });
        })
    );
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-delete_all
   */
  deleteAll(): number {
    const deleteCount = this.records.length;
    RecordCache.update(this.recordKlass.name, RECORD_ALL, []);
    this.records = [];
    return deleteCount;
  }

  /**
   * @see https://github.com/rails/rails/blob/5aaaa1630ae9a71b3c3ecc4dc46074d678c08d67/activerecord/lib/active_record/relation.rb#L613-L615
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-destroy_by
   * @todo Use ActiveRecord$QueryMethods#where
   */
  destroyBy(filter?: (self: T) => boolean): T[] {
    let leavedData = [];
    let deleteData = [];

    this.records.forEach((record) => {
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

    RecordCache.update(this.recordKlass.name, RECORD_ALL, leavedData);
    this.records = leavedData;

    deleteData.forEach((record) => {
      record._destroyed = true;
      Object.freeze(record);
    });
    return deleteData;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-destroy_all
   */
  destroyAll(): T[] {
    // @ts-ignore
    const destroyed = this.records.map((record: T) => {
      const destroyed = record.destroy<T>();
      Object.freeze(destroyed);
      return destroyed;
    });
    this.records = [];
    return destroyed;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-find_or_create_by
   */
  findOrCreateBy<U>(params: Partial<U>, yielder?: (self: T) => void): Promise<T> {
    return this.findBy<U>(params).then((record) => {
      if (record) {
        if (yielder) yielder(record);
        return record;
      } else {
        const createdRecord = this.create<Partial<U>>(params);
        if (yielder) yielder(createdRecord);
        return createdRecord;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-find_or_create_by-21
   */
  findOrCreateByOrThrow<U>(params: Partial<U>, yielder?: (self: T) => void): Promise<T> {
    // @ts-ignore
    return this.recordKlass.findBy<T, U>(params).then((record) => {
      if (record) {
        if (yielder) yielder(record);
        return record;
      } else {
        const createdRecord = this.createOrThrow<Partial<U>>(params);
        if (yielder) yielder(createdRecord);
        return createdRecord;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-find_or_initialize_by
   */
  findOrInitializeBy<U>(params: Partial<U>, yielder?: (self: T) => void): Promise<T> {
    // @ts-ignore
    return this.recordKlass.findBy<T, U>(params).then((record) => {
      if (record) {
        if (yielder) yielder(record);
        return record;
      } else {
        const newRecord = new this.recordKlass(params);
        // @ts-expect-error
        newRecord._newRecord = true;
        if (yielder) yielder(newRecord);
        return newRecord;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-update_all
   */
  updateAll<U>(params: Partial<U>): Promise<number> {
    const updateFn = (record: T): boolean => {
      return record.update(params);
    };

    return Promise.all(this.records.map(updateFn)).then((result) => {
      return Promise.resolve(result.filter(Boolean).length);
    });
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-touch_all
   */
  touchAll<U>(
    params?: Partial<U>,
    opts?: { withCreatedAt?: boolean; time?: string }
  ): Promise<number> {
    const updateProps =
      opts && opts.withCreatedAt ? [RUE_CREATED_AT, RUE_UPDATED_AT] : [RUE_UPDATED_AT];
    const datetime = opts && opts.time ? dayjs(opts.time).format() : dayjs().format();

    const touchFn = (record: T): boolean => {
      updateProps.forEach((timestamp) => {
        record.update({ [timestamp]: datetime });
      });
      return true;
    };

    return (
      this.recordKlass
        // @ts-expect-error
        .where<T, U>(params)
        .then((relation) => {
          const records = relation.toA();
          return Promise.all(records.map(touchFn)).then((result) => {
            this.records = RecordCache.read(this.recordKlass.name, RECORD_ALL, 'array');
            return result.filter(Boolean).length;
          });
        })
    );
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-to_ary
   */
  toArray(): T[] {
    Evaluator.all<T>(this);
    return this.records;
  }

  /**
   * @see https://api.rubyonrails.org/v6.1.3/classes/ActiveRecord/Relation.html#method-i-to_a
   * @alias toArray
   */
  toA(): T[] {
    Evaluator.all<T>(this);
    return this.records;
  }
}
