// locals

// functions
import { rueModuleExtend, rueModuleInclude, defineRueModule } from '@/modules';
// classes
import { Impl } from './impl';

// types
import * as mt from '@/modules';

export class Core extends Impl {
  static rueModuleInclude<T extends Function>(
    klass: T,
    module: mt.IRueModule,
    opts: mt.RueModuleOptions
  ) {
    rueModuleInclude(klass, module, opts);
  }

  static rueModuleExtend<T extends Function>(
    klass: T,
    module: mt.IRueModule,
    opts: mt.RueModuleOptions
  ) {
    rueModuleExtend(klass, module, opts);
  }

  static defineRueModule(name: string, body: mt.RueModuleBody): mt.IRueModule {
    return defineRueModule(name, body);
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
