import * as amt from '@rue/activemodel';
import * as mat from '@/records/modules/associations';

export type Params = amt.Model$Params & {
  id: mat.Associations$PrimaryKey;
};
export type ErrObj = amt.Model$ErrObj;
export type ObjType = amt.Model$ObjType;
export type Validations$Errors = amt.Model$Validations$Errors;
