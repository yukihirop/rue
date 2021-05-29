// local
import { cacheForRecords as RecordCache } from '@/registries';
import { ActiveRecord$Impl } from './impl';

// types
import type * as t from './types';

export const RUE_AUTO_INCREMENT_RECORD_ID = ActiveRecord$Impl[
  'RUE_AUTO_INCREMENT_RECORD_ID'
] as string;
export const RUE_CREATED_AT = ActiveRecord$Impl['RUE_CREATED_AT'] as string;
export const RUE_UPDATED_AT = ActiveRecord$Impl['RUE_UPDATED_AT'] as string;
export const RECORD_ALL = ActiveRecord$Impl['RECORD_ALL'] as string;
export const RECORD_META = ActiveRecord$Impl['RECORD_META'] as string;
export const RUE_RECORD_ID = ActiveRecord$Impl['RUE_RECORD_ID'] as string;

export class ActiveRecord$Base<P extends t.Params = t.Params> extends ActiveRecord$Impl<P> {
  public errors: t.Validations$Errors;

  constructor(data?: Partial<P>) {
    super();

    (this as any)[RUE_RECORD_ID] = undefined;

    if (data) {
      Object.keys(data).forEach((key) => {
        (this as any)[key] = data[key];
      });
    }

    this._newRecord = true;
    this._destroyed = false;
    this._associationCache = {};

    ActiveRecord$Impl.defineAssociations(this);
  }

  // override
  static get objType(): t.ObjType {
    return 'record';
  }

  protected fetchAll(): Promise<P[] | [] | { all?: P[]; meta?: any }> {
    throw "Please implement 'fetchAll' in Inherited Class";
  }

  // All starting points
  protected static fetchAll(): Promise<t.Params[] | { all?: t.Params[]; meta?: any }> {
    const instance = new this();
    return instance.fetchAll();
  }

  static resetRecordCache() {
    const cacheKey = this.uniqueKey;
    RecordCache.destroy(cacheKey);
    RecordCache.create(cacheKey, RECORD_ALL, []);
    RecordCache.create(cacheKey, RECORD_META, {});
    RecordCache.create(cacheKey, RUE_AUTO_INCREMENT_RECORD_ID, 1);
  }
}
