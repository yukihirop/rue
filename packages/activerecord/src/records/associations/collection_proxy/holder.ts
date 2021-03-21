// locals
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation$Holder } from '@/records/relations';

// types
import type * as ct from '@/types';
import type * as rat from '@/records/associations/types';

export class ActiveRecord$Associations$CollectionProxy$Holder<
  T extends ActiveRecord$Base
> extends ActiveRecord$Relation$Holder<T> {
  public associationData: rat.HolderAssociationData;
  public foreignKeyData: rat.HolderAssociationData['foreignKeyData'];
  public proxy: T[];
  public flags: {
    useProxy: boolean;
  };

  constructor(
    recordKlass: ct.Constructor<T>,
    records: T[],
    associationData: rat.HolderAssociationData
  ) {
    super(recordKlass, records);
    /**
     * @description Pass by value so that 「proxy === record」 does not occur
     */
    this.proxy = Array.from(records || []);
    this.flags = {
      useProxy: false,
    };
    this.associationData = associationData;
    // use it a lot so I have it as a member
    this.foreignKeyData = associationData.foreignKeyData;
    Object.assign(this.scopeParams.where, this.foreignKeyData);
  }
}
