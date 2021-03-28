import * as t from './types';

export const ErrCodes = {
  RECORD_IS_INVALID: 'RECORD_IS_INVALID',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  DIRECTION_IS_INVALID: 'DIRECTION_IS_INVALID',
  ARGUMENT_IS_INVALID: 'ARGUMENT_IS_INVALID',
  FOREIGN_KEY_CONSTRAIT_FAILS: 'FOREIGN_KEY_CONSTRAIT_FAILS',
  DELETE_RESTRICTION_ERROR: 'DELETE_RESTRICTION_ERROR',
};

export const ErrMessages: { [code: string]: t.ErrMessage } = {
  [ErrCodes.RECORD_IS_INVALID]: {
    message: (params = {} as any) => `${params['inspect']} is invalid.`,
  },
  [ErrCodes.RECORD_NOT_FOUND]: {
    message: (params = {} as any) =>
      `Couldn't find '${params['resource']}' with 'id' = '${params['id']}'`,
  },
  [ErrCodes.DIRECTION_IS_INVALID]: {
    message: (params = {} as any) =>
      `Direction '${params['direction']}' is invalid. Valid directions are: '[${params['directionList']}]'`,
  },
  [ErrCodes.ARGUMENT_IS_INVALID]: {
    message: (params = {} as any) => `Argument is invalid`,
  },
  [ErrCodes.FOREIGN_KEY_CONSTRAIT_FAILS]: {
    message: (params = {} as any) =>
      `Cannot delete or update a '${params['resource']}' record: a foreign key (${params['foreignKey']}) constraint fails`,
  },
  [ErrCodes.DELETE_RESTRICTION_ERROR]: {
    message: (params = {} as any) =>
      `Cannot delete record because of dependent '${params['associatedResource']}' records`,
  },
};
