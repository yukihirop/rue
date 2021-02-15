// types
import * as t from './types';

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
