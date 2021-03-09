import { RueModule } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation } from '@/records/relations';

// types
import type * as ct from '@/types';

// this is bound to an instance(class) of ActiveRecord$Relation (include runtime class)
export class ActiveRecord$QueryMethods extends RueModule {
  /**
   * Records cannot be created correctly without lazy evaluation
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-where
   */
  where<T extends ActiveRecord$Base, U>(params: Partial<U>): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    Object.assign(_this._whereParams, params || {});
    // @ts-expect-error
    _this.toPromiseArray = toPromiseArrayFn<T, U>(_this.recordKlass, _this._whereParams);
    _this.toPA = _this.toPromiseArray;
    // @ts-expect-error
    _this._currentScopeFn = _this.toPromiseArray;
    return _this;
  }

  /**
   * Records cannot be created correctly without lazy evaluation
   * @see https://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-rewhere
   */
  rewhere<T extends ActiveRecord$Base, U>(params: Partial<U>): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ActiveRecord$Relation<T>;
    // @ts-expect-error
    _this._whereParams = params || {};
    // @ts-expect-error
    _this.toPromiseArray = toPromiseArrayFn<T, U>(_this.recordKlass, _this._whereParams);
    _this.toPA = _this.toPromiseArray;
    // @ts-expect-error
    _this._currentScopeFn = _this.toPromiseArray;
    return _this;
  }
}

function toPromiseArrayFn<T extends ActiveRecord$Base, U>(
  recordKlass: ct.Constructor<T>,
  whereParams: Partial<U>
): () => Promise<T[]> {
  return () =>
    // @ts-expect-error
    recordKlass.all<T>().then((relation: ActiveRecord$Relation<T>) => {
      const records = relation.toA();
      const result = records.reduce((acc: Array<T>, record: T) => {
        const isMatch = Object.keys(whereParams)
          .map((key: string) => {
            const val = whereParams[key];
            if (Array.isArray(val)) {
              return val.includes(record[key]);
            } else {
              return (record as any)[key] === val;
            }
          })
          .every(Boolean);
        if (isMatch) acc.push(record);
        return acc;
      }, [] as Array<T>);
      return result;
    });
}
