// rue packages
import { ActiveSupport$Base as Support } from '@rue/activesupport';

// third party
import flatten from 'obj-flatten';

// local
import { ActiveModel$Impl } from './impl';

// types
import type * as t from './types';
import type { Validations$Errors } from '@/models/modules/validations';

export class ActiveModel$Base extends ActiveModel$Impl {
  public errors: Validations$Errors;

  static getProperties(): string[] {
    return Support.getProperties();
  }

  constructor(data: t.Params = {}) {
    super();
    this.errors = {};
    if (!data) data = {};
    Object.keys(data).forEach((key) => {
      (this as any)[key] = data[key];
    });
  }

  toObj(opts?: { flat: boolean }): t.Params {
    opts = opts == undefined ? { flat: false } : opts;
    const instance = Object.create(this);
    const obj = Object.assign({}, instance.__proto__);
    return opts.flat ? Object.assign(flatten(obj), { errors: obj.errors }) : obj;
  }

  inspect(): string {
    return Support.inspect(this);
  }
}
