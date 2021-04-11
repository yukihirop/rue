import * as amt from '@ruejs/activemodel';
import * as mat from '@/records/modules/associations';

export type Params = amt.Model$Params & {
  id: mat.Associations$PrimaryKey;
};
export type ErrObj = amt.Model$ErrObj;
export type ObjType = amt.Model$ObjType;
export type Validations$Errors = amt.Model$Validations$Errors & {
  belongsTo?: {
    [relationName: string]: ErrObj[];
  };
  hasOne?: {
    [relationName: string]: ErrObj[];
  };
  hasMany?: {
    [relationName: string]: ErrObj[];
  };
};
