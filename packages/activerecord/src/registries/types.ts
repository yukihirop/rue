// locals
import { Record } from '@/records';
import { AssociationList } from '@/associations';

// types
import * as at from '@/associations';

export type Associations = {
  [associationName in AssociationList]: {
    [uniqueRelationName: string]: (self: any) => Promise<Record[]>;
  };
};

export type Scopes = {
  scope: {
    [uniqueScopeName: string]: (...args) => Promise<Record[]>;
  };
};

export type IntermediateTables = {
  [klassName: string]: Array<[at.Association$ForeignKey, at.Association$ForeignKey]>;
};

export type Records = {
  __rue_auto_increment_record_id__: number;
  all: Array<Record>;
};
