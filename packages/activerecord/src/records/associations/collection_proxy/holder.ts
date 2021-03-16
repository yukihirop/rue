// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation$Holder } from '@/records/relations';

// types
import type * as ct from '@/types';
import type * as t from '@/index';

export class ActiveRecord$Associations$CollectionProxy$Holder<
  T extends ActiveRecord$Base
> extends ActiveRecord$Relation$Holder<T> {
  public foreignKeyData: { [key: string]: t.Record$ForeignKey };

  constructor(
    recordKlass: ct.Constructor<T>,
    records: T[],
    foreignKeyData: { [key: string]: t.Record$ForeignKey }
  ) {
    super(recordKlass, records);
    this.foreignKeyData = foreignKeyData;
    Object.assign(this.scopeParams.where, foreignKeyData);
  }
}
