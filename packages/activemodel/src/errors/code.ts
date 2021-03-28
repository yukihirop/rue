import i18n from '@/locales';

// types
import type * as t from './types';

function e(key: string, options?: any): string {
  return i18n.t(`errors.messages.${key}`, options).toString();
}

export const ErrCodes = {
  PROPERTY_IS_NOT_PRESENCE: 'PROPERTY_IS_NOT_PRESENCE',
  PROPERTY_IS_NOT_ABSENCE: 'PROPERTY_IS_NOT_ABSENCE',
  PROPERTY_IS_TOO_LONG_CHARS_LENGTH: 'PROPERTY_IS_TOO_LONG_CHARS_LENGTH',
  PROPERTY_IS_TOO_SHORT_CHARS_LENGTH: 'PROPERTY_IS_TOO_SHORT_CHARS_LENGTH',
  PROPERTY_IS_TOO_LONG_WORDS_LENGTH: 'PROPERTY_IS_TOO_LONG_WORDS_LENGTH',
  PROPERTY_IS_TOO_SHORT_WORDS_LENGTH: 'PROPERTY_IS_TOO_SHORT_WORDS_LENGTH',
  PROPERTY_IS_NOT_EQUAL_LENGTH: 'PROPERTY_IS_NOT_EQUAL_LENGTH',
  PROPERTY_IS_NOT_WITHIN_LENGTH: 'PROPERTY_IS_NOT_WITHIN_LENGTH',
  PROPERTY_IS_NOT_INCLUDED: 'PROPERTY_IS_NOT_INCLUDED',
  PROPERTY_IS_NOT_EXCLUDED: 'PROPERTY_IS_NOT_EXCLUDED',
  PROPERTY_DO_NOT_MEET_THE_CONDITION: 'PROPERTY_DO_NOT_MEET_THE_CONDITION',
  PROPERTY_DO_NOT_MEET_THE_FORMAT: 'PROPERTY_DO_NOT_MEET_THE_FORMAT',
  PROPERTY_IS_NOT_ONLY_INTEGER_NUMERIC: 'PROPERTY_IS_NOT_ONLY_INTEGER_NUMERIC',
  PROPERTY_IS_NOT_GREATER_THAN_NUMERIC: 'PROPERTY_IS_NOT_GREATER_THAN_NUMERIC',
  PROPERTY_IS_NOT_GREATER_THAN_OR_EQUAL_TO_NUMERIC:
    'PROPERTY_IS_NOT_GREATER_THAN_OR_EQUAL_TO_NUMERIC',
  PROPERTY_IS_NOT_EQUAL_TO_NUMERIC: 'PROPERTY_IS_NOT_EQUAL_TO_NUMERIC',
  PROPERTY_IS_NOT_LESS_THAN_NUMERIC: 'PROPERTY_IS_NOT_LESS_THAN_NUMERIC',
  PROPERTY_IS_NOT_LESS_THAN_OR_EQUAL_TO_NUMERIC: 'PROPERTY_IS_NOT_LESS_THAN_OR_EQUAL_TO_NUMERIC',
  PROPERTY_IS_NOT_ODD_NUMERIC: 'PROPERTY_IS_NOT_ODD_NUMERIC',
  PROPERTY_IS_NOT_EVEN_NUMERIC: 'PROPERTY_IS_NOT_EVEN_NUMERIC',
};

export const ErrMessages: { [code: string]: t.ErrMessage } = {
  [ErrCodes.PROPERTY_IS_NOT_PRESENCE]: {
    message: (params = {} as any) =>
      e('property_is_not_presence', {
        property: params['property'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_ABSENCE]: {
    message: (params = {} as any) =>
      e('property_is_not_absence', {
        property: params['property'],
      }),
  },
  [ErrCodes.PROPERTY_IS_TOO_LONG_CHARS_LENGTH]: {
    message: (params = {} as any) =>
      e('property_is_too_long_chars_length', {
        property: params['property'],
        maximum: params['maximum'],
      }),
  },
  [ErrCodes.PROPERTY_IS_TOO_SHORT_CHARS_LENGTH]: {
    message: (params = {} as any) =>
      e('property_is_too_short_chars_length', {
        property: params['property'],
        minimum: params['minimum'],
      }),
  },
  [ErrCodes.PROPERTY_IS_TOO_LONG_WORDS_LENGTH]: {
    message: (params = {} as any) =>
      e('property_is_too_long_words_length', {
        property: params['property'],
        maximum: params['maximum'],
      }),
  },
  [ErrCodes.PROPERTY_IS_TOO_SHORT_WORDS_LENGTH]: {
    message: (params = {} as any) =>
      e('property_is_too_short_words_length', {
        property: params['property'],
        minimum: params['minimum'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_EQUAL_LENGTH]: {
    message: (params = {} as any) =>
      e('property_is_not_equal_length', {
        property: params['property'],
        is: params['is'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_WITHIN_LENGTH]: {
    message: (params = {} as any) =>
      e('property_is_not_within_length', {
        property: params['property'],
        within: params['within'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_INCLUDED]: {
    message: (params = {} as any) =>
      e('property_is_not_included', {
        property: params['property'],
        list: params['list'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_EXCLUDED]: {
    message: (params = {} as any) =>
      e('property_is_not_excluded', {
        property: params['property'],
        list: params['list'],
      }),
  },
  [ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION]: {
    message: (params = {} as any) =>
      e('property_do_not_meet_the_condition', {
        property: params['property'],
        condition: params['condition'],
      }),
  },
  [ErrCodes.PROPERTY_DO_NOT_MEET_THE_FORMAT]: {
    message: (params = {} as any) =>
      e('property_do_not_meet_the_format', {
        property: params['property'],
        format: params['format'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_ONLY_INTEGER_NUMERIC]: {
    message: (params = {} as any) =>
      e('property_is_not_only_integer_numeric', {
        property: params['property'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_GREATER_THAN_NUMERIC]: {
    message: (params = {} as any) =>
      e('property_is_not_greater_than_numeric', {
        property: params['property'],
        greaterThan: params['greaterThan'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_GREATER_THAN_OR_EQUAL_TO_NUMERIC]: {
    message: (params = {} as any) =>
      e('property_is_not_greater_than_or_equal_to_numeric', {
        property: params['property'],
        greaterThanOrEqualTo: params['greaterThanOrEqualTo'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_EQUAL_TO_NUMERIC]: {
    message: (params = {} as any) =>
      e('property_is_not_equal_to_numeric', {
        property: params['property'],
        equalTo: params['equalTo'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_LESS_THAN_NUMERIC]: {
    message: (params = {} as any) =>
      e('property_is_not_less_than_numeric', {
        property: params['property'],
        lessThan: params['lessThan'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_LESS_THAN_OR_EQUAL_TO_NUMERIC]: {
    message: (params = {} as any) =>
      e('property_is_not_less_than_or_equal_to_numeric', {
        property: params['property'],
        lessThanOrEqualTo: params['lessThanOrEqualTo'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_ODD_NUMERIC]: {
    message: (params = {} as any) =>
      e('property_is_not_odd_numeric', {
        property: params['property'],
      }),
  },
  [ErrCodes.PROPERTY_IS_NOT_EVEN_NUMERIC]: {
    message: (params = {} as any) =>
      e('property_is_not_even_numeric', {
        property: params['property'],
      }),
  },
};
