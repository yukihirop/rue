// locals
import { ActiveRecord$Base } from '@/records';
import { AssociationList } from '@/records/modules/associations';

// types
import * as at from '@/records/modules/associations';

export type Associations = {
  [associationName in AssociationList]: {
    [uniqueRelationName: string]: (self: any) => Promise<ActiveRecord$Base[]>;
  };
};

export type Scopes = {
  scope: {
    [uniqueScopeName: string]: (...args) => Promise<ActiveRecord$Base[]>;
  };
};

export type IntermediateTables = {
  [klassName: string]: Array<[at.Associations$ForeignKey, at.Associations$ForeignKey]>;
};

export type Records = {
  __rue_auto_increment_record_id__: number;
  all: Array<ActiveRecord$Base>;
};
