import * as et from '@/errors';

export type Options<T = any, U = any> = Partial<{
  presence: true;
  absence: true;
  length: Partial<{
    maximum: number;
    minimum: number;
    // for maximum/minimum option
    tokenizer: (propVal: T, self: U) => string[];
    in: [number, number];
    // alias in
    within: [number, number];
    is: number;
  }>;
  inclusion: {
    in: Array<string | number | boolean | undefined | null>;
  };
  exclusion: {
    in: Array<string | number | boolean | undefined | null>;
  };
  condition: [string, (propVal: T, self: U) => boolean];
  format: {
    with: RegExp | 'email' | 'IPv4' | 'IPv6';
  };
  numericality: Partial<{
    onlyInteger: true;
    greaterThan: number;
    greaterThanOrEqualTo: number;
    equalTo: number;
    lessThan: number;
    lessThanOrEqualTo: number;
    odd: true;
    even: true;
  }>;
  // common option
  message: ((translatedPropKey: string, propVal: T, self: U) => string) | string;
  if: (propVal: T, self: U) => boolean;
  allow_blank: boolean;
  allow_null: boolean;
  allow_undefined: boolean;
  // common option
}>;

export type Errors = { [propKey: string]: Array<et.ErrObj> };
