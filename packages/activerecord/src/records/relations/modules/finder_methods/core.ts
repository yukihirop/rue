// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { errObj, ErrCodes } from '@/errors';
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';

// types
import type * as t from './types';
import type * as at from '@/records/modules/associations';

// this is bound to an instance(class) of ActiveRecord$Relation
export class ActiveRecord$FinderMethods extends RueModule {
  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-exists-3F
   * @todo After where corresponds to the array argument, also correspond to the array argument
   */
  isExists<T extends ActiveRecord$Base, U>(condition?: t.ExistsCondition<U>): Promise<boolean> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;

    if (!condition) {
      // @ts-expect-error
      return Promise.resolve(_this.records.length > 0);
    } else if (Array.isArray(condition)) {
      throw 'Do not suppport because where does not correspond to an array argument';
    } else if (typeof condition === 'object' && condition != null) {
      return _this
        .where<U>(condition as Partial<U>)
        .toPA()
        .then((records) => records.length > 0);
    } else {
      const primaryKey = Number(condition) as at.Associations$PrimaryKey;
      return _this.find<U>(primaryKey).then((record) => !!record);
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-find
   */
  find<T extends ActiveRecord$Base, U = { [key: string]: any }>(
    ...primaryKeys: at.Associations$PrimaryKey[]
  ): Promise<T | T[]> {
    if (primaryKeys.length === 0) {
      return Promise.reject(
        errObj({
          code: ErrCodes.RECORD_NOT_FOUND,
          // @ts-expect-error
          message: `Could'nt find '${this.recordKlass.name}' without an 'primaryKey'`,
        })
      );
    } else {
      // @ts-expect-error
      return (this as ActiveRecord$Relation)
        .where<T, U>({ primaryKey: primaryKeys })
        .toPA()
        .then((records) => {
          if (records.length === 0) {
            if (primaryKeys.length === 1) {
              throw errObj({
                code: ErrCodes.RECORD_NOT_FOUND,
                params: {
                  // @ts-expect-error
                  resource: this.recordKlass.name,
                  primaryKey: primaryKeys[0],
                },
              });
            } else {
              throw errObj({
                code: ErrCodes.RECORD_NOT_FOUND,
                // @ts-expect-error
                message: `Could't find all '${this.recordKlass.name}' with 'primaryKey': [${primaryKeys}] (found 0 results, but was looking for ${primaryKeys.length})`,
              });
            }
          } else if (records.length === 1) {
            return records[0];
          } else {
            return records;
          }
        });
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-find_by
   */
  findBy<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T> {
    // @ts-expect-error
    return (this as ActiveRecord$Relation<T>).where<T, U>(params).take<T>();
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-find_by-21
   */
  findByOrThrow<T extends ActiveRecord$Base, U>(params: Partial<U>): Promise<T> {
    // @ts-expect-error
    return (this as ActiveRecord$Relation<T>).where<T, U>(params).takeOrThrow<T>();
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-first
   */
  first<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    return this.take<T>(limit);
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-first-21
   */
  firstOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    return this.takeOrThrow(limit);
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-include-3F
   */
  isInclude<T extends ActiveRecord$Base>(record: T): boolean {
    const { RUE_RECORD_ID } = ActiveRecord$Base;
    // @ts-expect-error
    const allRecordIds = (this as ActiveRecord$Relation<T>).records.map((r) => r[RUE_RECORD_ID]);
    return allRecordIds.includes(record[RUE_RECORD_ID]);
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-member-3F
   * @alias isInclude
   */
  isMember<T extends ActiveRecord$Base>(record: T): boolean {
    return this.isInclude(record);
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-last
   */
  last<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    const { RUE_RECORD_ID } = ActiveRecord$Base;
    if (!limit) limit = 1;
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    if (!_this._currentScopeFn) _this._currentScopeFn = () => Promise.resolve(_this.records);
    // @ts-expect-error
    return _this._currentScopeFn().then((records) => {
      if (records.length === 0) {
        return Promise.resolve(null);
      } else if (limit === 1) {
        return Promise.resolve(records[0]);
      } else {
        const slicedRecords = records
          .sort((a, b) => b[RUE_RECORD_ID] - a[RUE_RECORD_ID])
          .slice(0, limit)
          .reverse();
        return slicedRecords;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-last-21
   */
  lastOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    return this.last<T>(limit).then((record) => {
      if (record === null) {
        throw errObj({
          code: ErrCodes.RECORD_NOT_FOUND,
          // @ts-expect-error
          message: `Couldn't find '${this.recordKlass.name}'`,
        });
      } else {
        return record;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-take
   */
  take<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    if (!limit) limit = 1;
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    if (!_this._currentScopeFn) _this._currentScopeFn = () => Promise.resolve(_this.records);
    // @ts-expect-error
    return _this._currentScopeFn().then((records) => {
      if (records.length === 0) {
        return null;
      } else if (limit === 1) {
        return records[0];
      } else {
        return records.slice(0, limit);
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-take-21
   */
  takeOrThrow<T extends ActiveRecord$Base>(limit?: number): Promise<T | T[]> {
    return this.take<T>(limit).then((record) => {
      if (record === null) {
        throw errObj({
          code: ErrCodes.RECORD_NOT_FOUND,
          // @ts-expect-error
          message: `Couldn't find '${this.recordKlass.name}'`,
        });
      } else {
        return record;
      }
    });
  }
}