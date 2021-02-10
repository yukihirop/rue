import { errObj, ErrCodes } from '@/errors';

// types
import type * as t from '../types';
import type * as et from '@/errors';

export function validate(
  propKey: string,
  propVal: number,
  numericality: t.Options['numericality'],
  translate: (propKey: string) => string,
  message?: string
): Array<et.ErrObj> | boolean {
  let result = [];

  if (numericality.onlyInteger && !Number.isInteger(propVal)) {
    result.push('onlyInteger');
  }

  if (numericality.greaterThan && !(propVal > numericality.greaterThan)) {
    result.push('greaterThan');
  }

  if (numericality.greaterThanOrEqualTo && !(propVal >= numericality.greaterThanOrEqualTo)) {
    result.push('greaterThanOrEqualTo');
  }

  if (numericality.equalTo && !(propVal == numericality.equalTo)) {
    result.push('equalTo');
  }

  if (numericality.lessThan && !(propVal < numericality.lessThan)) {
    result.push('lessThan');
  }

  if (numericality.lessThanOrEqualTo && !(propVal <= numericality.lessThanOrEqualTo)) {
    result.push('lessThanOrEqualTo');
  }

  if (numericality.odd && !(propVal % 2 != 0)) {
    result.push('odd');
  }

  if (numericality.even && !(propVal % 2 == 0)) {
    result.push('even');
  }

  if (result.length == 0) return true;

  const errObjs = {
    onlyInteger: errObj({
      code: ErrCodes.PROPERTY_IS_NOT_ONLY_INTEGER_NUMERIC,
      params: {
        property: translate(propKey),
      },
      message,
    }),
    greaterThan: errObj({
      code: ErrCodes.PROPERTY_IS_NOT_GREATER_THAN_NUMERIC,
      params: {
        property: translate(propKey),
        greaterThan: numericality.greaterThan!,
      },
      message,
    }),
    greaterThanOrEqualTo: errObj({
      code: ErrCodes.PROPERTY_IS_NOT_GREATER_THAN_OR_EQUAL_TO_NUMERIC,
      params: {
        property: translate(propKey),
        greaterThanOrEqualTo: numericality.greaterThanOrEqualTo!,
      },
      message,
    }),
    equalTo: errObj({
      code: ErrCodes.PROPERTY_IS_NOT_EQUAL_TO_NUMERIC,
      params: {
        property: translate(propKey),
        equalTo: numericality.equalTo!,
      },
      message,
    }),
    lessThan: errObj({
      code: ErrCodes.PROPERTY_IS_NOT_LESS_THAN_NUMERIC,
      params: {
        property: translate(propKey),
        lessThan: numericality.lessThan!,
      },
      message,
    }),
    lessThanOrEqualTo: errObj({
      code: ErrCodes.PROPERTY_IS_NOT_LESS_THAN_OR_EQUAL_TO_NUMERIC,
      params: {
        property: translate(propKey),
        lessThanOrEqualTo: numericality.lessThanOrEqualTo!,
      },
      message,
    }),
    odd: errObj({
      code: ErrCodes.PROPERTY_IS_NOT_ODD_NUMERIC,
      params: {
        property: translate(propKey),
        odd: numericality.odd!,
      },
      message,
    }),
    even: errObj({
      code: ErrCodes.PROPERTY_IS_NOT_EVEN_NUMERIC,
      params: {
        property: translate(propKey),
        even: numericality.even!,
      },
      message,
    }),
  };

  return result.reduce((acc: Array<et.ErrObj>, key: string) => {
    const err = (errObjs as any)[key];
    acc.push(err);
    return acc;
  }, [] as Array<et.ErrObj>);
}
