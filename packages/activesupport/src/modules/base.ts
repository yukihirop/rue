// types
import * as t from './types';

const RUE_MODULE = '__rue_module__';
const RUE_ANCESTORS = '__rue_ancestors__';
const RUE_ABSTRACT_CLASS = '__rue_abstract_class__';
const RUE_DESCRIPTION = '__rue_description__';

export abstract class RueModule {
  static readonly RUE_MODULE = RUE_MODULE;
  static readonly RUE_ANCESTORS = RUE_ANCESTORS;
  static readonly RUE_ABSTRACT_CLASS = RUE_ABSTRACT_CLASS;
  static readonly RUE_DESCRIPTION = RUE_DESCRIPTION;

  static readonly __rue_module__ = true;
  static __rue_ancestors__ = [];
  static readonly __rue_description__ = `
This is Rue Module(~ abstract class).
Run 'RueModule.prototype' or 'Object.keys(RueModule)' and so on to see more details.
It has the following as internal static properties.

・__rue_module__ = true (readonly)
・__rue_ancestors__ = [] (Function | RueModule)`;

  constructor() {
    // RueModule description for display
    `
This is Rue Module(~ abstract class).
Run 'RueModule.prototype' or 'Object.keys(RueModule)' and so on to see more details.
It has the following as internal static properties.

・__rue_module__ = true (readonly)
・__rue_ancestors__ = [] (Function | RueModule)`;

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
  if (!klass[RUE_ANCESTORS]) klass[RUE_ANCESTORS] = [];

  const dupRueAncestors = Array.from(klass[RUE_ANCESTORS]);
  let currentKlassLastAncestor = dupRueAncestors.pop();

  // not klass[RUE_LAST_ANCESTOR_MODULE]
  // Even if you refer to it directly, you will see what is inherited.
  if (
    klass.hasOwnProperty(RUE_ANCESTORS) &&
    currentKlassLastAncestor &&
    currentKlassLastAncestor[RUE_MODULE]
  ) {
    if (!klass[RUE_ANCESTORS].includes(rueModule)) {
      klass[RUE_ANCESTORS].push(rueModule);
    }
  } else {
    const rueAncestorLength = klass[RUE_ANCESTORS].length;

    if (rueAncestorLength == 0) {
      klass[RUE_ANCESTORS].push(rueModule);
    } else {
      for (let i = 0; i < rueAncestorLength; i++) {
        let currentKlassAncestor = klass[RUE_ANCESTORS][i];
        if (!currentKlassAncestor[RUE_MODULE]) {
          if (!klass[RUE_ANCESTORS].includes(rueModule)) {
            klass[RUE_ANCESTORS].splice(i + 1, 0, rueModule);
          }
          break;
        }
        if (i == rueAncestorLength - 1) {
          if (!klass[RUE_ANCESTORS].includes(rueModule)) {
            klass[RUE_ANCESTORS].push(rueModule);
          }
        }
      }
    }
  }
}
