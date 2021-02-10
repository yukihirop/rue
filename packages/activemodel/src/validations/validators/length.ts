import { errObj, ErrCodes } from '@/errors';

// types
import type * as t from '../types';
import type * as et from '@/errors';

export function validate<T = string | any[] | { [key in string | number]: any }, U = any>(
  self: U,
  propKey: string,
  propVal: T,
  length: t.Options['length'],
  translate: (propKey: string) => string,
  message?: string
): Array<et.ErrObj> | boolean {
  let result = [];
  let propValLen;

  if (typeof propVal == 'string' || Array.isArray(propVal)) {
    propValLen = propVal.length;
    if (length && length.tokenizer) {
      propValLen = length.tokenizer(propVal, self).length;
    } else {
      propValLen = propVal.length;
    }
  } else if (Array.isArray(propVal)) {
    propValLen = propVal.length;
  } else if (typeof propVal == 'object') {
    propValLen = Object.keys(propVal).length;
  }

  if (length && length.maximum && propValLen > length.maximum) {
    if (length && length.tokenizer) {
      result.push('tooLongWords');
    } else {
      result.push('tooLongChars');
    }
  }

  if (length && length.minimum && propValLen < length.minimum) {
    if (length && length.tokenizer) {
      result.push('tooShortWords');
    } else {
      result.push('tooShortChars');
    }
  }

  if (length && length.is && propValLen != length.is) {
    result.push('is');
  }
  if (length && length.in && !(length.in[0] <= propValLen && propValLen <= length.in[1])) {
    result.push('within');
  }
  if (
    length &&
    length.within &&
    !(length.within[0] <= propValLen && propValLen <= length.within[1])
  ) {
    result.push('within');
  }

  if (result.length == 0) return true;

  const errObjs = {
    tooLongChars: errObj({
      code: ErrCodes.PROPERTY_IS_TOO_LONG_CHARS_LENGTH,
      params: {
        property: translate(propKey),
        maximum: length.maximum!,
      },
      message,
    }),
    tooShortChars: errObj({
      code: ErrCodes.PROPERTY_IS_TOO_SHORT_CHARS_LENGTH,
      params: {
        property: translate(propKey),
        minimum: length.minimum!,
      },
      message,
    }),
    tooLongWords: errObj({
      code: ErrCodes.PROPERTY_IS_TOO_LONG_WORDS_LENGTH,
      params: {
        property: translate(propKey),
        maximum: length.maximum!,
      },
      message,
    }),
    tooShortWords: errObj({
      code: ErrCodes.PROPERTY_IS_TOO_SHORT_WORDS_LENGTH,
      params: {
        property: translate(propKey),
        minimum: length.minimum!,
      },
      message,
    }),
    is: errObj({
      code: ErrCodes.PROPERTY_IS_NOT_EQUAL_LENGTH,
      params: {
        property: translate(propKey),
        is: length.is!,
      },
      message,
    }),
    within: errObj({
      code: ErrCodes.PROPERTY_IS_NOT_WITHIN_LENGTH,
      params: {
        property: translate(propKey),
        within: JSON.stringify(length.in! || length.within!),
      },
      message,
    }),
  };

  return result.reduce((acc: et.ErrObj[], key: string) => {
    const err = (errObjs as any)[key];
    acc.push(err);
    return acc;
  }, [] as et.ErrObj[]);
}
