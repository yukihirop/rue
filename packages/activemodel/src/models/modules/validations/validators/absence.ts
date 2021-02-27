import { errObj, ErrCodes } from '@/errors';

// types
import type * as t from '../types';
import type * as et from '@/errors';

export function validate<
  T = any | any[] | { [key: string]: any } | { [key: number]: any } | undefined | null
>(
  propKey: string,
  propVal: T,
  absence: Required<t.Options['absence']>,
  translate: (propKey: string) => string,
  message?: string
): Array<et.ErrObj> | boolean {
  let result = false;

  if (absence) {
    if (typeof propVal == 'undefined' && propVal == undefined) {
      result = true;
    } else if (typeof propVal == 'object' && propVal == null) {
      result = true;
    }
  }

  if (result) return true;
  return [
    errObj({
      code: ErrCodes.PROPERTY_IS_NOT_ABSENCE,
      params: {
        property: translate(propKey),
      },
      message,
    }),
  ];
}
