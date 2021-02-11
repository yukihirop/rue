import { errObj, ErrCodes } from '@/errors';

// types
import type * as t from '../types';
import type * as et from '@/errors';

export function validate(
  propkey: string,
  propVal: string | number | boolean | undefined | null,
  inclusion: Required<t.Options>['inclusion'],
  translate: (propKey: string) => string,
  message?: string
): Array<et.ErrObj> | boolean {
  let result = false;

  if (inclusion && inclusion.in) {
    const incl = inclusion.in!;
    if (incl.includes(propVal)) result = true;
  }

  if (result) return true;

  const safeIn = inclusion!.in.map((i) => (typeof i == 'undefined' ? 'undefined' : i));
  return [
    errObj({
      code: ErrCodes.PROPERTY_IS_NOT_INCLUDED,
      params: {
        property: translate(propkey),
        list: JSON.stringify(safeIn),
      },
      message,
    }),
  ];
}
