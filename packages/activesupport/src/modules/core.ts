// types
import * as t from './types';

const RUE_MODULE = '__rue_module__';
const RUE_ANCESTOR_MODULE = '__rue_ancestor_module__';

export function defineRueModule(name: string, body: t.RueModuleBody): t.IRueModule {
  // https://stackoverflow.com/a/48899028/9434894
  let rueModule = { [name]: function () {} }[name];
  rueModule[RUE_MODULE] = true;
  rueModule[RUE_ANCESTOR_MODULE] = Object;
  rueModule['body'] = body;
  rueModule['constant'] = body.constant!;
  rueModule['static'] = body.static!;
  rueModule['instance'] = body.instance!;

  // define constants
  Object.keys(body.constant || {}).forEach((constName: string) => {
    rueModule[constName] = body.constant[constName];
  });

  // define static methods
  Object.keys(body.static || {}).forEach((methodName: string) => {
    rueModule[methodName] = body.static[methodName];
  });

  // define instance methods
  Object.keys(body.instance || {}).forEach((methodName: string) => {
    rueModule.prototype[methodName] = body.instance[methodName];
  });

  // @ts-ignore
  return rueModule as t.IRueModule;
}

export function rueModuleInclude<T extends Function>(
  klass: T,
  rueModule: t.IRueModule,
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

    Object.keys(rueModule.instance || {}).forEach((methodName) => {
      if (opts && opts.only && opts.only.includes(methodName)) {
        klass.prototype[methodName] = rueModule.instance[methodName];
      }
    });
  } else {
    throw 'rueModuleInclude';
  }
}

export function rueModuleExtend<T extends Function>(
  klass: T,
  rueModule: t.IRueModule,
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

    Object.keys(rueModule.static || {}).forEach((methodName) => {
      if (opts && opts.only && opts.only.includes(methodName)) {
        klass[methodName] = rueModule.static[methodName];
      }
    });

    Object.keys(rueModule.constant || {}).forEach((constName) => {
      if (opts && opts.only && opts.only.includes(constName)) {
        klass[constName] = rueModule.constant[constName];
      }
    });
  } else {
    throw 'rueModuleExtend';
  }
}
