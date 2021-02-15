// rue packages
import { ActiveModel$Error } from '@rue/activemodel';

// local
import { ErrMessages } from './code';

// types
import * as t from './types';

const NAMESPACE = '@rue/activerecord';

export class ActiveRecord$Error extends ActiveModel$Error {}

export function createErrObj({
  code,
  params,
  message,
}: {
  code: string;
  params?: any;
  message?: string;
}): t.ErrObj {
  let { message: msg } = ErrMessages[code];
  let calcMessage: string = msg instanceof Function ? msg(params) : msg!;
  const maybeOverrideMessage = message != undefined ? message : calcMessage;

  const err = new ActiveRecord$Error(maybeOverrideMessage);
  err.namespace = NAMESPACE;
  err.code = code;
  err.message = maybeOverrideMessage!;

  return err;
}