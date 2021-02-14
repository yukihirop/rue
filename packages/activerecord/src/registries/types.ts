// locals
import { Record } from '@/records';
import { AssociationList } from '@/associations';

// types
import * as at from '@/associations';

export type RegistryData<T> = {
  [klassName: string]: T;
};

export type RegistryType = 'array' | 'object' | 'value';

export type RegistryValue =
  | {
      [key: string]: any;
    }
  | any[]
  | any;

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
