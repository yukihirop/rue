// types
import * as t from './types';

export abstract class RueModule {
  static readonly RUE_MODULE = '__rue_module__';
  static readonly RUE_ANCESTOR = '__rue_ancestor__';
  static readonly RUE_LAST_ANCESTOR_MODULE = '__rue_last_ancestor_module__';
  static readonly RUE_ABSTRACT_CLASS = '__rue_abstract_class__';
  static readonly RUE_DESCRIPTION = '__rue_description__';

  static readonly __rue_module__ = true;
  static __rue_ancestor__ = Object;
  static __rue_last_ancestor_module__ = undefined;
  static readonly __rue_description__ = `
This is Rue Module(~ abstract class).
Run 'RueModule.prototype' or 'Object.keys(RueModule)' and so on to see more details.
It has the following as internal static properties.

・__rue_module__ = true (readonly)
・__rue_ancestor__ = Object (Function | RueModule)
・__rue_last_ancestor_module__ = undefied (RueModule)`;

  constructor() {
    // RueModule description for display
    `
This is Rue Module(~ abstract class).
Run 'RueModule.prototype' or 'Object.keys(RueModule)' and so on to see more details.
It has the following as internal static properties.

・__rue_module__ = true (readonly)
・__rue_ancestor__ = Object (Function | RueModule)
・__rue_last_ancestor_module__ = undefied (RueModule)`;

    throw `Could not create ${this.constructor.name} instance. Cause: ${this.constructor.name} is RueModule (~ abstract class)`;
  }

  static rueModuleIncludedFrom<T extends Function>(klass: T, opts: t.RueModuleOptions) {
    if (this.__rue_module__) {
      // Update Rue Ancestor Chain
      updateRueAncestorChain(klass, this);

      Object.keys(Object.getOwnPropertyDescriptors(this.prototype)).forEach((methodName) => {
        if (opts && opts.only && opts.only.includes(methodName)) {
          if (methodName != 'constructor') klass.prototype[methodName] = this.prototype[methodName];
        }
      });
    } else {
      throw 'rueModuleIncludedFrom';
    }
  }

  static rueModuleExtendedFrom<T extends Function>(klass: T, opts: t.RueModuleOptions) {
    if (this.__rue_module__) {
      // Update Rue Ancestor Chain
      updateRueAncestorChain(klass, this);

      Object.keys(Object.getOwnPropertyDescriptors(this)).forEach((methodName) => {
        if (opts && opts.only && opts.only.includes(methodName)) {
          if (methodName != 'name') klass[methodName] = this[methodName];
        }
      });
    } else {
      throw 'rueModuleExtendedFrom';
    }
  }
}

// C:Core
// I:Impl
//
// C=>I=>M1=>M2=>C=>I=>M1=>M2
// C=>I=>M1=>M2=>M3=>C=>
function updateRueAncestorChain<T extends Function>(klass: T, rueModule: typeof RueModule) {
  // not klass[RUE_LAST_ANCESTOR_MODULE]
  // Even if you refer to it directly, you will see what is inherited.
  const { RUE_MODULE, RUE_ANCESTOR, RUE_LAST_ANCESTOR_MODULE } = rueModule;
  if (
    klass.hasOwnProperty(RUE_LAST_ANCESTOR_MODULE) &&
    klass[RUE_LAST_ANCESTOR_MODULE][rueModule.RUE_MODULE]
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

function updateRueGrandsonChain<T extends Function>(klass: T, rueModule: typeof RueModule) {
  const { RUE_ANCESTOR } = rueModule;
  const oldRueModleAncestor = rueModule[RUE_ANCESTOR];

  if (oldRueModleAncestor && oldRueModleAncestor == Object) {
    // @ts-ignore
    rueModule[RUE_ANCESTOR] = klass;
  } else if (oldRueModleAncestor && oldRueModleAncestor !== Object) {
    updateRueGrandsonChain(klass, oldRueModleAncestor as any);
  }
}
