import { errObj, ErrCodes } from '@/errors';

// types
import type * as t from '../types';
import type * as et from '@/errors';

export function validate<
  T = any | any[] | { [key: string]: any } | { [key: number]: any } | undefined | null
>(
  propKey: string,
  propVal: T,
  presence: Required<t.Options>['presence'],
  translate: (propKey: string) => string,
  message?: string
): Array<et.ErrObj> | boolean {
  let result = false;

  if (presence) {
    if (propVal != undefined && Array.isArray(propVal)) {
      result = true;
    } else if (typeof propVal == 'object' && propVal != null) {
      result = true;
    } else if (['', 0, [], {}].includes(propVal as any)) {
      result = true;
    } else if (!!propVal) {
      result = true;
    }
  }

  if (result) return true;
  return [
    errObj({
      code: ErrCodes.PROPERTY_IS_NOT_PRESENCE,
      params: {
        property: translate(propKey),
      },
      message,
    }),
  ];
}
