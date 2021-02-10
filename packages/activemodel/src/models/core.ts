// third party
import flatten from 'obj-flatten';

// local
import { Validation } from '@/validations';
import { Translation } from './methods';

// types
import type * as t from './types';

const TRANSLATE_CACHE_KEY = '__rue_translate__';

export class Core extends Validation {
  static _cache: t.Params = {};

  private static _getCache(klassName: string, key: string) {
    if (!Core._cache[klassName]) {
      Core._cache[klassName] = {};
    }
    return Core._cache[klassName][key];
  }

  // Set to Core because it needs to be called from the instance
  private static _setCache(key: string, val: any) {
    if (!Core._cache[this.name]) {
      Core._cache[this.name] = {};
    }
    Core._cache[this.name][key] = val;
  }

  static loadTranslator() {
    // cache translate
    this._setCache(TRANSLATE_CACHE_KEY, this.translate);
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
    const translate = Core._getCache(klassName, TRANSLATE_CACHE_KEY) as (propKey: string) => string;
    return Translation.humanPropertyName(key, translate);
  }
}
