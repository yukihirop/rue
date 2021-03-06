// locals
import { errObj, ErrCodes } from '@/errors';
import { ActiveRecord$Base, RECORD_ALL, RUE_CREATED_AT, RUE_UPDATED_AT } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import dayjs from 'dayjs';

// types
import type * as ct from '@/types';

export class ActiveRecord$Relation$Base<T extends ActiveRecord$Base> {
  private recordKlass: ct.Constructor<T>;
  private records: T[];

  constructor(recordKlass: ct.Constructor<T>, records: T[]) {
    this.recordKlass = recordKlass;
    this.records = records || [];
  }

  isMany(filter?: (record: T) => boolean): boolean {
    return this.records.filter(filter || Boolean).length > 1;
  }

  isNone(filter?: (record: T) => boolean): boolean {
    return this.records.filter(filter || Boolean).length === 0;
  }

  isOne(filter?: (record: T) => boolean): boolean {
    return this.records.filter(filter || Boolean).length === 1;
  }

  isAny(filter?: (record: T) => boolean): boolean {
    return this.records.filter(filter || Boolean).length > 0;
  }

  isBlank(): boolean {
    return this.records.length == 0;
  }

  build<U>(params?: Partial<U>, yielder?: (self: T) => void): T {
    // @ts-ignore
    const record = new this.recordKlass(params);
    if (yielder) yielder(record);
    return record;
  }

  create<U>(params?: Partial<U>): T {
    // @ts-ignore
    const record = new this.recordKlass(params);
    record.save();
    this.records.push(record);
    return record;
  }

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

  createOrFindBy<U>(params: Partial<U>): Promise<T> {
    // @ts-ignore
    return (this.recordKlass as typeof ActiveRecord$Base).findBy(params).then((record) => {
      if (record) {
        return Promise.resolve(record);
      } else {
        const createdRecord = this.create<Partial<U>>(params);
        return Promise.resolve(createdRecord);
      }
    });
  }

  createOrFindByOrThrow<U>(params: Partial<U>): Promise<T> {
    // @ts-ignore
    return (this.recordKlass as typeof ActiveRecord$Base).findBy<T, U>(params).then((record) => {
      if (record) {
        return Promise.resolve(record);
      } else {
        try {
          const record = this.createOrThrow<U>(params);
          return Promise.resolve(record);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    });
  }

  deleteBy<P>(params?: Partial<P>): Promise<number> {
    const deleteRecordFn = (record: T) => {
      record.destroy();
      return true;
    };

    return (
      this.recordKlass
        // @ts-ignore
        .where<P>(params)
        .toPA()
        .then((records: T[]) => {
          return Promise.all(records.map(deleteRecordFn)).then((result) => {
            this.records = RecordCache.read(this.recordKlass.name, RECORD_ALL, 'array');
            return Promise.resolve(result.filter(Boolean).length);
          });
        })
    );
  }

  // TODO: Use ActiveRecord$QueryMethods#where
  // https://github.com/rails/rails/blob/5aaaa1630ae9a71b3c3ecc4dc46074d678c08d67/activerecord/lib/active_record/relation.rb#L613-L615
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

    deleteData.forEach((record) => Object.freeze(record));
    return deleteData;
  }

  deleteAll(): number {
    const deleteCount = this.records.length;
    RecordCache.update(this.recordKlass.name, RECORD_ALL, []);
    this.records = [];
    return deleteCount;
  }

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

  findOrCreateBy<U>(params: Partial<U>, yielder?: (self: T) => void): Promise<T> {
    // @ts-ignore
    return this.recordKlass.findBy<T, U>(params).then((record) => {
      if (record) {
        if (yielder) yielder(record);
        return Promise.resolve(record);
      } else {
        const createdRecord = this.create<Partial<U>>(params);
        if (yielder) yielder(createdRecord);
        return Promise.resolve(createdRecord);
      }
    });
  }

  findOrCreateByOrThrow<U>(params: Partial<U>, yielder?: (self: T) => void): Promise<T> {
    // @ts-ignore
    return this.recordKlass.findBy<T, U>(params).then((record) => {
      if (record) {
        if (yielder) yielder(record);
        return Promise.resolve(record);
      } else {
        try {
          const createdRecord = this.createOrThrow<Partial<U>>(params);
          if (yielder) yielder(createdRecord);
          return Promise.resolve(createdRecord);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    });
  }

  findOrInitializeBy<U>(params: Partial<U>, yielder?: (self: T) => void): Promise<T> {
    // @ts-ignore
    return this.recordKlass.findBy<T, U>(params).then((record) => {
      if (record) {
        if (yielder) yielder(record);
        return Promise.resolve(record);
      } else {
        const newRecord = new this.recordKlass(params);
        if (yielder) yielder(newRecord);
        return Promise.resolve(newRecord);
      }
    });
  }

  updateAll<U>(params: Partial<U>): Promise<number> {
    const updateFn = (record: T): boolean => {
      return record.update(params);
    };

    return Promise.all(this.records.map(updateFn)).then((result) => {
      return Promise.resolve(result.filter(Boolean).length);
    });
  }

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
        // @ts-ignore
        .where<T, U>(params)
        .toPA()
        .then((records) => {
          return Promise.all(records.map(touchFn)).then((result) => {
            this.records = RecordCache.read(this.recordKlass.name, RECORD_ALL, 'array');
            return Promise.resolve(result.filter(Boolean).length);
          });
        })
    );
  }

  toArray(): T[] {
    return this.records;
  }

  // @alias
  toA(): T[] {
    return this.records;
  }
}
