// rue packages
import { RueModule } from '@rue/activesupport';

// thrid party
import flatten from 'obj-flatten';
import unflatten from 'obj-unflatten';

// local
import { ActiveModel$Base } from '@/models';
import * as Validator from './validators';
import { registryForValidations as Registry } from '@/registries';

// types
import type * as t from './types';
import type * as et from '@/errors';
import type * as rt from '@/registries';

// this is bound to an instance(class) of ActiveModel$Base
export class ActiveModel$Validations extends RueModule {
  public errors: t.Errors;

  isInvalid(): boolean {
    return !this.isValid();
  }

  isValid(): boolean {
    this.errors = {};
    const klassName = this.constructor.name;

    // Returns true if validation is not set
    if (Registry.data[klassName] == undefined || null) return true;

    Object.keys(Registry.data[klassName]).forEach((propKey: string) => {
      this.errors[propKey] = this.errors[propKey] || [];

      const fnArray = Registry.read<rt.ValidationFn[]>(klassName, propKey);
      let propVal = this._toObj({ flat: true })[propKey];

      // It may be a reactive object, and if it is destructively changed, it will lead to a problem, so verify it with a copy.
      if (typeof propVal === 'string' || Array.isArray(propVal)) {
        propVal = propVal.slice();
      } else if (typeof propVal === 'object' && propVal != null) {
        propVal = Object.assign({}, propVal);
      }

      let maybeErrors: Array<et.ErrObj> = [];

      let fnVal;
      fnArray.forEach((fn) => {
        if (fn.length == 2) {
          fnVal = fn(propVal, this);
        } else {
          fnVal = fn(propVal);
        }

        if (Array.isArray(fnVal)) {
          maybeErrors.push(...fnVal);
        }
      });

      if (maybeErrors.length == 0) return;

      maybeErrors.forEach((maybeError: et.ErrObj) => {
        if (maybeError instanceof Error) {
          this.errors[propKey].push(maybeError);
        }
      });
    });

    const flattenErrors = this.errors;
    // unflatten errors
    this.errors = unflatten(this.errors, '.');

    return !Object.values(flattenErrors).some((e) => e.length > 0);
  }

  _toObj(opts?: { flat: boolean }): { [key: string]: any } {
    opts = opts == undefined ? { flat: false } : opts;
    const instance = Object.create(this);
    const obj = Object.assign({}, instance.__proto__);
    return opts.flat ? flatten(obj) : obj;
  }

  static objType(): t.ObjType {
    return 'model';
  }

  static validates<T = any, U extends ActiveModel$Validations = any>(
    propKey: string,
    opts: t.Options<T, U>
  ) {
    if (Registry.data[this.name] == undefined) {
      Registry.data[this.name] = {};
    }

    if (Registry.read(this.name, propKey) == undefined) {
      Registry.update(this.name, propKey, []);
    }

    // @ts-ignore
    const translate = (this as typeof ActiveModel$Base).__t.bind(this);

    const ifEval = <K, V>(propVal: K, self: V): boolean => {
      if (opts.if) {
        const $if = opts.if;
        return $if(propVal as any, self as any);
      } else {
        return true;
      }
    };

    const skipValidation = (propVal: any): boolean => {
      let result = [];

      if (opts.allow_null) {
        result.push(propVal == null);
      }

      if (opts.allow_undefined) {
        result.push(propVal == undefined);
      }

      if (opts.allow_blank) {
        const r = ['', {}, [], null].includes(propVal);
        result.push(r);
      }

      return result.some(Boolean);
    };

    const messageEval = <K, V>(propKey: string, propVal: K, self: V): string => {
      if (typeof opts.message === 'string') {
        return opts.message! as string;
      } else if (typeof opts.message === 'undefined') {
        return undefined;
      } else {
        const fnMessage = (opts.message! as t.Options['message']) as (
          translatedPropKey: string,
          propVal: K,
          self: V
        ) => string;
        // @ts-ignore
        return fnMessage((this as typeof ActiveModel$Base).__t(propKey), propVal, self) as string;
      }
    };

    if (opts.presence != undefined) {
      Registry.create(this.name, propKey, [
        (propVal: T, self: U) =>
          ifEval<T, U>(propVal, self) && !skipValidation(propVal)
            ? Validator.validatePresence<T>(
                propKey,
                propVal,
                opts.presence!,
                translate,
                messageEval(propKey, propVal, self)
              )
            : [],
      ]);
    }

    if (opts.absence != undefined) {
      Registry.create(this.name, propKey, [
        (propVal: T, self: U) =>
          ifEval<T, U>(propVal, self) && !skipValidation(propVal)
            ? Validator.validateAbsence<T>(
                propKey,
                propVal,
                opts.absence!,
                translate,
                messageEval(propKey, propVal, self)
              )
            : [],
      ]);
    }

    if (opts.length != undefined && Object.keys(opts.length).length > 0) {
      Registry.create(this.name, propKey, [
        (propVal: string | any[] | { [key in string | number]: any }, self: U) =>
          ifEval<string | any[] | { [key in string | number]: any }, U>(propVal, self) &&
          !skipValidation(propVal)
            ? Validator.validateLength<string | any[] | { [key in string | number]: any }, U>(
                self,
                propKey,
                propVal,
                opts.length!,
                translate,
                messageEval(propKey, propVal, self)
              )
            : [],
      ]);
    }

    if (opts.inclusion != undefined && Object.keys(opts.inclusion).length > 0) {
      Registry.create(this.name, propKey, [
        (propVal: string | number | boolean, self: U) =>
          ifEval<string | number | boolean, U>(propVal, self) && !skipValidation(propVal)
            ? Validator.validateInclusion(
                propKey,
                propVal,
                opts.inclusion!,
                translate,
                messageEval(propKey, propVal, self)
              )
            : [],
      ]);
    }

    if (opts.exclusion != undefined && Object.keys(opts.exclusion).length > 0) {
      Registry.create(this.name, propKey, [
        (propVal: string | number | boolean, self: U) =>
          ifEval<string | number | boolean, U>(propVal, self) && !skipValidation(propVal)
            ? Validator.validateExclusion(
                propKey,
                propVal,
                opts.exclusion!,
                translate,
                messageEval(propKey, propVal, self)
              )
            : [],
      ]);
    }

    if (opts.condition != undefined && opts.condition.length == 2) {
      Registry.create(this.name, propKey, [
        (propVal: T, self: U) =>
          ifEval<T, U>(propVal, self) && !skipValidation(propVal)
            ? Validator.validateCondition<T, U>(
                self,
                propKey,
                propVal,
                opts.condition!,
                translate,
                messageEval(propKey, propVal, self)
              )
            : [],
      ]);
    }

    if (opts.format != undefined && Object.keys(opts.format).length > 0) {
      Registry.create(this.name, propKey, [
        (propVal: string, self: U) =>
          ifEval<string, U>(propVal, self) && !skipValidation(propVal)
            ? Validator.validateFormat(
                propKey,
                propVal,
                opts.format!,
                translate,
                messageEval(propKey, propVal, self)
              )
            : [],
      ]);
    }

    if (opts.numericality != undefined && Object.keys(opts.numericality).length > 0) {
      Registry.create(this.name, propKey, [
        (propVal: number, self: U) =>
          ifEval<number, U>(propVal, self) && !skipValidation(propVal)
            ? Validator.validateNumericality(
                propKey,
                propVal,
                opts.numericality!,
                translate,
                messageEval(propKey, propVal, self)
              )
            : [],
      ]);
    }
  }
}
