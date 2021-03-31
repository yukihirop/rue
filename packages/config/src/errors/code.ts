// types
import type * as t from './types';

export const ErrCodes = {
  CONFIG_IS_INVALID: 'CONFIG_IS_INVALID',
};

export const ErrMessages: { [code: string]: t.ErrMessage } = {
  [ErrCodes.CONFIG_IS_INVALID]: {
    message: (params = {} as any) => `Rue Runtime Config is invalid. ${params['body']}`,
  },
};
