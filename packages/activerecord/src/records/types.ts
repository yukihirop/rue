import { HasAndBelongsToMany } from './modules/associations/types';
import * as amt from '@rue/activemodel';
import * as mat from '@/records/modules/associations';

export type Params = amt.Model$Params & {
  id: mat.Associations$PrimaryKey;
};
export type ErrObj = amt.Model$ErrObj;
export type ObjType = amt.Model$ObjType;
export type Validations$Errors = amt.Model$Validations$Errors & {
  hasOne?: {
    [relationName: string]: ErrObj[];
  };
  hasMany?: {
    [relationName: string]: ErrObj[];
  };
  HasAndBelongsToMany?: {
    [relationName: string]: ErrObj[];
  };
};
