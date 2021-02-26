// classes
export { Record } from './records';
export { ActiveRecord$Error } from './errors';

// functions
export { errObj } from './errors';

// enums
export { ErrCodes } from './errors';

// types

// prettier-ignore
export type {
  Associations$PrimaryKey as Record$PrimaryKey,
  Associations$ForeignKey as Record$ForeignKey,
  Associations$BelongsTo as Record$BelongsTo,
  Associations$HasOne as Record$HasOne,
  Associations$HasMany as Record$HasMany,
  Associations$CollectionProxy$Scope as Record$Scope,
} from './records/modules/associations';

// prettier-ignore
export type {
  Record$Params, Record$ObjType,
  Record$Validation$Errors
} from './records';

// prettier-ignore
export type {
  ErrObj as Record$ErrObj,
  ErrMessage as Record$ErrMessage
} from './errors';
