// locals
import { Record } from '@/records';
import { AssociationList } from '@/associations';
import { RECORD_AUTO_INCREMENNT_ID, RECORD_ALL } from '@/records/core';

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
  [RECORD_AUTO_INCREMENNT_ID]: number;
  [RECORD_ALL]: Array<Record>;
};
