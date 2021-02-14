// tyeps
import * as et from '@/errors';

export type ValidationFn = (
  propVal: string | number | any,
  self?: any
) => Array<et.ErrObj> | boolean | [];

export type Validations = {
  [propKey: string]: Array<ValidationFn>;
};

export type Translator = (propKey: string) => string;
