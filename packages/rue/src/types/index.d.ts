declare module '@ruejs/rue' {
  // types
  // prettier-ignore
  import type {
  Model$Validations$Options,
  Model$Validations$Errors,
  Model$Params,
  Model$ObjType,
  Model$ErrObj,
  Model$ErrMessage,
} from '@ruejs/activemodel';

  // prettier-ignore
  import type {
  ActiveRecord$Base,
  Record$PrimaryKey,
  Record$ForeignKey,
  Record$BelongsTo,
  Record$HasOne,
  Record$HasMany,
  Record$Scope,
  Record$Params,
  Record$ObjType,
  Record$Validations$Errors,
  Record$ErrObj,
  Record$ErrMessage,
  } from '@ruejs/activerecord';

  // @ruejs/activemodel
  export const Model$Validations$Options: Model$Validations$Options;
  export const Model$Validations$Errors: Model$Validations$Errors;
  export const Model$Params: Model$Params;
  export const Model$ObjType: Model$ObjType;
  export const Model$ErrObj: Model$ErrObj;
  export const Model$ErrMessage: Model$ErrMessage;

  // @ruejs/activerecord
  export const Record$PrimaryKey: Record$PrimaryKey;
  export const Record$ForeignKey: Record$ForeignKey;
  export function Record$BelongsTo<
    T extends ActiveRecord$Base<Record$Params>
  >(): Record$BelongsTo<T>;
  export function Record$HasOne<T extends ActiveRecord$Base<Record$Params>>(): Record$HasOne<T>;
  export function Record$HasMany<T extends ActiveRecord$Base<Record$Params>>(): Record$HasMany<T>;
  export function Record$Scope<T extends ActiveRecord$Base<Record$Params>>(): Record$Scope<T>;
  export const Record$Params: Record$Params;
  export const Record$ObjType: Record$ObjType;
  export const Record$Validations$Errors: Record$Validations$Errors;
  export const Record$ErrObj: Record$ErrObj;
  export const Record$ErrMessage: Record$ErrMessage;
}
