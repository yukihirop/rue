// locals
import { ActiveRecord$Base } from '@/records';

// types
import type * as et from '@/errors';
import type * as ct from '@/types';
import type * as mt from './modules';

export class ActiveRecord$Relation$Holder<T extends ActiveRecord$Base> {
  public recordKlass: ct.Constructor<T>;
  public records: T[];
  public scopeParams: {
    where: { [key: string]: any };
    order: { [key: string]: mt.QueryMethods$Directions };
    offset?: number;
    limit?: number;
    group: string[];
  };
  public groupedRecords: { [key: string]: T[] };
  public errors: et.ErrObj[];
  private _defaultScopeParams: any;
  public readonly isHolder = true;

  constructor(recordKlass: ct.Constructor<T>, records: T[]) {
    this.recordKlass = recordKlass;
    this.records = records || [];
    this._defaultScopeParams = {
      where: {},
      order: {},
      offset: undefined,
      limit: undefined,
      group: [],
    };
    Object.freeze(this._defaultScopeParams);
    // Must be passed by value
    this.scopeParams = Object.assign({}, JSON.parse(JSON.stringify(this._defaultScopeParams)));
    this.groupedRecords = {};
    this.errors = [];
  }
}
