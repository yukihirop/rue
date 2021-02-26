import { errObj, ErrCodes } from '@/errors';

// types
import type * as t from '../types';
import type * as et from '@/errors';

export function validate(
  propkey: string,
  propVal: string | number | boolean | undefined | null,
  exclusion: Required<t.Options>['exclusion'],
  translate: (propKey: string) => string,
  message?: string
): Array<et.ErrObj> | boolean {
  let result = false;

  if (exclusion && exclusion.in) {
    const excl = exclusion.in!;
    if (!excl.includes(propVal)) result = true;
  }

  if (result) return true;

  const safeIn = exclusion!.in.map((i) => (typeof i == 'undefined' ? 'undefined' : i));
  return [
    errObj({
      code: ErrCodes.PROPERTY_IS_NOT_EXCLUDED,
      params: {
        property: translate(propkey),
        list: JSON.stringify(safeIn),
      },
      message,
    }),
  ];
}
