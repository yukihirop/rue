// rue packages
import { Support } from '@rue/activesupport';
import type * as st from '@rue/activesupport';

// third party
import flatten from 'obj-flatten';

// local
import { Impl } from './impl';
import { registryForTranslator as Registry } from '@/registries';

// types
import type * as t from './types';
import type { Validation$Errors } from '@/validations';

const TRANSLATE_KEY = Impl['TRANSLATE_KEY'];

export class Core extends Impl {
  public errors: Validation$Errors;

  static loadTranslator() {
    // register translate
    Registry.create('ActiveModel', TRANSLATE_KEY, this.translate);
  }

  static moduleInclude(module: st.Support$Module, opts?: st.Support$ModuleOptions) {
    Support.moduleInclude(this, module, opts);
  }

  static moduleExtend(module: st.Support$Module, opts?: st.Support$ModuleOptions) {
    Support.moduleExtend(this, module, opts);
  }

  static getMethods(): string[] {
    return Support.getMethods();
  }

  static getProperties(): string[] {
    return Support.getProperties();
  }

  constructor(data: t.Params = {}) {
    super();
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
