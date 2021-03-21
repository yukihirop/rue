// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation$Holder } from '@/records/relations';

// types
import type * as ct from '@/types';
import type * as t from './types';

export class ActiveRecord$Associations$Holder<
  T extends ActiveRecord$Base
> extends ActiveRecord$Relation$Holder<T> {
  public associationData: t.HolderAssociationData;
  public foreignKeyData: t.HolderAssociationData['foreignKeyData'];

  constructor(
    recordKlass: ct.Constructor<T>,
    records: T[],
    associationData: t.HolderAssociationData
  ) {
    super(recordKlass, records);
    this.associationData = associationData;
    this.foreignKeyData = associationData.foreignKeyData;
  }
}
