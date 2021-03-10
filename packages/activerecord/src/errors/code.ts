import * as t from './types';

export const enum ErrCodes {
  RECORD_IS_INVALID = 'RECORD_IS_INVALID',
  RECORD_DO_NOT_HAVE_HAS_AND_BELONGS_TO_MANY = 'RECORD_DO_NOT_HAVE_HAS_AND_BELONGS_TO_MANY',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DIRECTION_IS_INVALID = 'DIRECTION IS INVALID',
  ARGUMENT_IS_INVALID = 'ARGUMENT_IS_INVALID',
}

export const ErrMessages: { [code: string]: t.ErrMessage } = {
  [ErrCodes.RECORD_IS_INVALID]: {
    message: (params = {} as any) => `${params['inspect']} is invalid.`,
  },
  [ErrCodes.RECORD_DO_NOT_HAVE_HAS_AND_BELONGS_TO_MANY]: {
    message: (params = {} as any) =>
      `'${params['klassNameLeft']}' don't have 'hasAndBelongsToMany' associations with ${params['klassNameRight']}.`,
  },
  [ErrCodes.RECORD_NOT_FOUND]: {
    message: (params = {} as any) =>
      `Couldn't find '${params['resource']}' with 'primaryKey' = '${params['primaryKey']}'`,
  },
  [ErrCodes.DIRECTION_IS_INVALID]: {
    message: (params = {} as any) =>
      `Direction '${params['direction']}' is invalid. Valid directions are: '[${params['directionList']}]'`,
  },
  [ErrCodes.ARGUMENT_IS_INVALID]: {
    message: (params = {} as any) => `Argument is invalid`,
  },
};
