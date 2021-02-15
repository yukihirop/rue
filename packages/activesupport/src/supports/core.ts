// locals

// functions
import { moduleInclude, moduleExtend } from '@/modules';
// classes
import { Impl } from './impl';

// types
import * as mt from '@/modules';

export class Core extends Impl {
  static moduleInclude<T extends Function>(klass: T, module: mt.Module, opts?: mt.ModuleOptions) {
    moduleInclude(klass, module, opts);
  }

  static moduleExtend<T extends Function>(klass: T, module: mt.Module, opts?: mt.ModuleOptions) {
    moduleExtend(klass, module, opts);
  }

  static inspect(instance: any): string {
    const klassName = instance.constructor.name;
    let sorted = {};

    const keys = Object.keys(instance).sort();
    keys.forEach(function (key) {
      sorted[key] = this[key];
    }, instance);

    return `${klassName} ${JSON.stringify(sorted, null, 2)}`;
  }
}
