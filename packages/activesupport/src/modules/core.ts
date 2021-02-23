// types
import * as t from './types';

export const RUE_MODULE = '__rue_module__';
export const RUE_ANCESTOR = '__rue_ancestor__';
export const RUE_LAST_ANCESTOR_MODULE = '__rue_last_ancestor_module__';
export const RUE_ABSTRACT_CLASS = '__rue_abstract_class__';
const RUE_DESCRIPTION = '__rue_description__';

export function defineRueModule(moduleName: string, body: t.RueModuleBody): t.IRueModule {
  // https://stackoverflow.com/a/48899028/9434894
  let rueModule = {
    [moduleName]: class {
      // RueModule description for display
      static readonly [RUE_DESCRIPTION] = `
This is Rue Module(~ abstract class).
Run 'RueModule.prototype' or 'Object.keys(RueModule)' and so on to see more details.
It has the following as internal static properties.

・__rue_module__ = true (readonly)
・__rue_ancestor__ = Object (Function | RueModule)
・__rue_last_ancestor_module__ = undefied (RueModule)

It also has the following static properties.

・body
・constant
・static
・instance

e.g.) RueModule.body`;

      static readonly [RUE_MODULE] = true;
      static [RUE_ANCESTOR] = Object;
      static [RUE_LAST_ANCESTOR_MODULE] = undefined;
      static body = body;
      static constant = body.constant;
      static static = body.static;
      static instance = body.instance;

      constructor() {
        // RueModule description for display
        `
This is Rue Module(~ abstract class).
Run 'RueModule.prototype' or 'Object.keys(RueModule)' and so on to see more details.
It has the following as internal static properties.

・__rue_module__ = true (readonly)
・__rue_ancestor__ = Object (Function | RueModule)
・__rue_last_ancestor_module__ = undefied (RueModule)

It also has the following static properties.

・body
・constant
・static
・instance

e.g.) RueModule.body`;
        throw `Could not create ${moduleName} instance. Cause: ${moduleName} is RueModule (~ abstract class)`;
      }
    },
  }[moduleName];

  // Class name override
  // https://qiita.com/suin/items/97247695ded57c927316
  Object.defineProperty(rueModule, 'name', {
    writable: false,
    configurable: false,
    enumerable: true,
    value: moduleName,
  });

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
    // Update Rue Ancestor Chain
    updateRueAncestorChain(klass, rueModule);

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
    // Update Rue Ancestor Chain
    updateRueAncestorChain(klass, rueModule);

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

// C:Core
// I:Impl
//
// C=>I=>M1=>M2=>C=>I=>M1=>M2
// C=>I=>M1=>M2=>M3=>C=>
function updateRueAncestorChain<T extends Function>(klass: T, rueModule: t.IRueModule) {
  // not klass[RUE_LAST_ANCESTOR_MODULE]
  // Even if you refer to it directly, you will see what is inherited.
  if (
    klass.hasOwnProperty(RUE_LAST_ANCESTOR_MODULE) &&
    klass[RUE_LAST_ANCESTOR_MODULE][RUE_MODULE]
  ) {
    if (klass[RUE_LAST_ANCESTOR_MODULE][RUE_MODULE] != rueModule) {
      klass[RUE_LAST_ANCESTOR_MODULE][RUE_ANCESTOR] = rueModule;
      klass[RUE_LAST_ANCESTOR_MODULE] = rueModule;
    }
    const superclass = Object.getPrototypeOf(klass);
    if (superclass) {
      if (rueModule[RUE_LAST_ANCESTOR_MODULE]) {
        updateRueGrandsonChain(superclass, rueModule[RUE_LAST_ANCESTOR_MODULE]);
      } else {
        rueModule[RUE_ANCESTOR] = superclass;
      }
    }
  } else {
    const superclass = Object.getPrototypeOf(klass);

    // C=>[I]=>{M1=>M11=>M12}=>C=>I
    klass[RUE_LAST_ANCESTOR_MODULE] = rueModule;
    klass[RUE_ANCESTOR] = rueModule;

    // C=>[I]=>M1=>M11=>{M12}=>C=>I
    if (rueModule[RUE_LAST_ANCESTOR_MODULE]) {
      rueModule[RUE_LAST_ANCESTOR_MODULE][RUE_ANCESTOR] = superclass;
    } else {
      rueModule[RUE_ANCESTOR] = superclass;
    }
  }
}

function updateRueGrandsonChain<T extends Function>(klass: T, rueModule: t.IRueModule) {
  const oldRueModleAncestor = rueModule[RUE_ANCESTOR];

  if (oldRueModleAncestor && oldRueModleAncestor == Object) {
    rueModule[RUE_ANCESTOR] = klass;
  } else if (oldRueModleAncestor && oldRueModleAncestor !== Object) {
    updateRueGrandsonChain(klass, oldRueModleAncestor as t.IRueModule);
  }
}
