import { errObj, ErrCodes } from '@/errors';

// types
import type * as t from '../types';
import type * as et from '@/errors';

export function validate<T = any, U = any>(
  self: U,
  propKey: string,
  propVal: T,
  condition: Required<t.Options<T>>['condition'],
  translate: (propKey: string) => string,
  message?: string
): Array<et.ErrObj> | boolean {
  let result = false;
  const conditionName = condition[0];
  const fn = condition[1];

  if (typeof fn === 'function') {
    result = fn(propVal, self);
  }

  if (result) return true;
  return [
    errObj({
      code: ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION,
      params: {
        property: translate(propKey),
        condition: conditionName,
      },
      message,
    }),
  ];
}
