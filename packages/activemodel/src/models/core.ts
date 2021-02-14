// third party
import flatten from 'obj-flatten';

// local
import { Validation } from '@/validations';
import { Translation } from './methods';
import { registryForTranslator as Registry } from '@/registries';

// types
import type * as t from './types';
import type { Validation$Errors } from '@/validations';
import type * as rt from '@/registries';

const TRANSLATE_CACHE_KEY = '__rue_translate__';

export class Core extends Validation {
  public errors: Validation$Errors;

  static loadTranslator() {
    // register translate
    Registry.create(this.name, TRANSLATE_CACHE_KEY, this.translate);
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

  humanPropertyName(key: string): string {
    const klassName = this.constructor.name;
    const translate = Registry.read<rt.Translator>(klassName, TRANSLATE_CACHE_KEY);
    return Translation.humanPropertyName(key, translate);
  }
}
