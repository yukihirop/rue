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
export const RUE_RECORD_ID = ActiveRecord$Impl['RUE_RECORD_ID'] as string;

export class ActiveRecord$Base extends ActiveRecord$Impl {
  public errors: t.Validations$Errors;

  constructor(data: t.Params = {}) {
    super();

    (this as any)[RUE_RECORD_ID] = undefined;

    Object.keys(data).forEach((key) => {
      (this as any)[key] = data[key];
    });

    this._newRecord = true;
    this._destroyed = false;

    ActiveRecord$Impl.defineAssociations(this);
  }

  // override
  static objType(): t.ObjType {
    return 'record';
  }

  protected static fetchAll<T = any>(): Promise<Array<T>> {
    throw "Please implement '[static] fetchAll' in Inherited Class";
  }

  static resetRecordCache() {
    const klassName = this.name;
    RecordCache.destroy(klassName);
    RecordCache.create(klassName, RECORD_ALL, []);
    RecordCache.create(klassName, RUE_AUTO_INCREMENT_RECORD_ID, 1);
  }
}
