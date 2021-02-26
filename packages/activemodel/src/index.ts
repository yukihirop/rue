// classes
export { ActiveModel$Validations } from './models/modules';
// prettier-ignore
export {
  // TODO: delete this
  Model,
  ActiveModel$Base
} from './models';
export { ActiveModel$Error } from './errors';

// functions
export { errObj } from './errors';

// types
export type { Validations$Options, Validations$Errors } from './models/modules/validations';
export type { Model$Params, Model$ObjType } from './models';
export type { ErrObj as Model$ErrObj, ErrMessage as Model$ErrMessage } from './errors';

// enums
export type { ErrCodes } from './errors';
