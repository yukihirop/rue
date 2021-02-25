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
  Association$PrimaryKey as Record$PrimaryKey,
  Association$ForeignKey as Record$ForeignKey,
  Association$BelongsTo as Record$BelongsTo,
  Association$HasOne as Record$HasOne,
  Association$HasMany as Record$HasMany,
  Association$Scope as Record$Scope,
} from './associations';

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

// docs
import docs from './docs.json';
export { docs };
