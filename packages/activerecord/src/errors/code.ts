import * as t from './types';

export const enum ErrCodes {
  RECORD_IS_INVALID = 'RECORD_IS_INVALID',
  RECORD_DO_NOT_HAVE_HAS_AND_BELONGS_TO_MANY = 'RECORD D NOT HAVE HAS_AND_BELONGS_TO_MANY',
}

export const ErrMessages: { [code: string]: t.ErrMessage } = {
  [ErrCodes.RECORD_IS_INVALID]: {
    message: (params = {} as any) => `${params['inspect']} is invalid.`,
  },
  [ErrCodes.RECORD_DO_NOT_HAVE_HAS_AND_BELONGS_TO_MANY]: {
    message: (params = {} as any) =>
      `'${params['klassNameLeft']}' don't have 'hasAndBelongsToMany' associations with ${params['klassNameRight']}.`,
  },
};
