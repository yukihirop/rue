// types
import * as t from './types';

const RUE_MODULE = '__rue_module__';
const RUE_ANCESTOR_MODULE = '__rue_ancestor_module__';

export function moduleInclude<T extends Function>(
  klass: T,
  module: t.Module,
  opts?: t.ModuleOptions
) {
  if (module.isModule) {
    Object.keys(module).forEach((methodName) => {
      if (opts && opts.only && opts.only.includes(methodName)) {
        klass.prototype[methodName] = module[methodName];
      }
    });
  } else {
    throw 'moduleInclude';
  }
}

export function moduleExtend<T extends Function>(
  klass: T,
  module: t.Module,
  opts?: t.ModuleOptions
) {
  if (module.isModule) {
    Object.keys(module).forEach((methodName) => {
      if (opts && opts.only && opts.only.includes(methodName)) {
        klass[methodName] = module[methodName];
      }
    });
  } else {
    throw 'moduleExtend';
  }
}

export function defineRueModule(name: string, body: t.RueModuleBody): t.RueModule {
  // https://stackoverflow.com/a/48899028/9434894
  let rueModule = { [name]: function () {} }[name];
  rueModule[RUE_MODULE] = true;
  rueModule[RUE_ANCESTOR_MODULE] = Object;
  rueModule['body'] = body;

  // define static methods
  Object.keys(body.static).forEach((methodName: string) => {
    rueModule[methodName] = body.static[methodName];
  });

  // define instance methods
  Object.keys(body.instance).forEach((methodName: string) => {
    rueModule.prototype[methodName] = body.instance[methodName];
  });

  return rueModule as t.RueModule;
}

export function rueModuleInclude<T extends Function>(
  klass: T,
  rueModule: t.RueModule,
  opts: t.RueModuleOptions
) {
  if (rueModule[RUE_MODULE]) {
    // Update Rue Module Chain
    const maybyAncestorModule = klass[RUE_ANCESTOR_MODULE];

    if (maybyAncestorModule) {
      maybyAncestorModule[RUE_ANCESTOR_MODULE] = rueModule;
    } else {
      klass[RUE_ANCESTOR_MODULE] = rueModule;
    }

    const instance = new (rueModule as any)();
    Object.keys(instance).forEach((methodName) => {
      if (opts && opts.only && opts.only.includes(methodName)) {
        klass.prototype[methodName] = rueModule[methodName];
      }
    });
  } else {
    throw 'rueModuleInclude';
  }
}

export function rueModuleExtend<T extends Function>(
  klass: T,
  rueModule: t.RueModule,
  opts: t.RueModuleOptions
) {
  if (rueModule[RUE_MODULE]) {
    // Update Rue Module Chain
    const maybyAncestorModule = klass[RUE_ANCESTOR_MODULE];
    if (maybyAncestorModule) {
      maybyAncestorModule[RUE_ANCESTOR_MODULE] = rueModule;
    } else {
      klass[RUE_ANCESTOR_MODULE] = rueModule;
    }

    Object.keys(rueModule).forEach((methodName) => {
      if (opts && opts.only && opts.only.includes(methodName)) {
        klass[methodName] = rueModule[methodName];
      }
    });
  } else {
    throw 'rueModuleExtend';
  }
}
