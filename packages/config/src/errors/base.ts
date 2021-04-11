import { ErrMessages } from './code';

// types

import * as t from './types';

const NAMESPACE = '@ruejs/activemodel';

// The namespace is given to the name so that "ActiveModel$Error" is displayed when viewed on the console.
export class RueConfig$Error extends Error implements t.ErrObj {
  private _namespace?: string;
  private _code?: string;
  private _message?: string;

  get namespace(): string {
    return this._namespace || '';
  }

  set namespace(val: string) {
    this._namespace = val;
  }

  get code(): string {
    return this._code || '';
  }

  set code(val: string) {
    this._code = val;
  }

  get message(): string {
    return this._message || '';
  }

  set message(val: string) {
    this._message = val;
  }
}

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

  const err = new RueConfig$Error(maybeOverrideMessage);
  err.namespace = NAMESPACE;
  err.code = code;
  err.message = maybeOverrideMessage!;

  return err;
}
