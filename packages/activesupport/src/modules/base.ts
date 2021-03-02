// locals
import { registryForRueModule as Registry } from '@/registries';

// types
import * as t from './types';

const RUE_MODULE = '__rue_module__';
const RUE_ANCESTORS = '__rue_ancestors__';
const RUE_ABSTRACT_CLASS = '__rue_abstract_class__';
const RUE_DESCRIPTION = '__rue_description__';

export abstract class RueModule {
  static readonly RUE_MODULE = RUE_MODULE;
  static readonly RUE_ABSTRACT_CLASS = RUE_ABSTRACT_CLASS;
  static readonly RUE_DESCRIPTION = RUE_DESCRIPTION;

  static readonly __rue_module__ = true;
  static readonly __rue_description__ = `
This is Rue Module(~ abstract class).
Run 'RueModule.prototype' or 'Object.keys(RueModule)' and so on to see more details.
It has the following as internal static properties.

・__rue_module__ = true (readonly)`;

  constructor() {
    // RueModule description for display
    `
This is Rue Module(~ abstract class).
Run 'RueModule.prototype' or 'Object.keys(RueModule)' and so on to see more details.
It has the following as internal static properties.

・__rue_module__ = true (readonly)`;

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

export class RueModuleAncestorController {
  public klass: RueModule;
  public data: t.RueModuleAncestors;

  constructor(klass: RueModule) {
    this.klass = klass;
    this.data = Registry.read<t.RueModuleAncestors>(this.klass['name'], RUE_ANCESTORS, 'array');
  }

  create(val: t.RueModuleAncestors) {
    Registry.create(this.klass['name'], RUE_ANCESTORS, val);
    this.data = val;
  }

  update(val: t.RueModuleAncestors) {
    Registry.update(this.klass['name'], RUE_ANCESTORS, val);
    this.data = Registry.read<t.RueModuleAncestors>(this.klass['name'], RUE_ANCESTORS, 'array');
  }

  ancestors(): t.RueModuleAncestors {
    const _getAncestors = (
      klass: RueModule,
      result: t.RueModuleAncestors[]
    ): t.RueModuleAncestors[] => {
      const controller = new RueModuleAncestorController(klass);
      if (!result.includes(klass as any)) result.push(klass as any);

      controller.data.forEach((childKlass) => {
        if (childKlass != Object) {
          const childAncestors = _getAncestors(childKlass, result);
          childAncestors.forEach((ancestor) => {
            if (!result.includes(ancestor)) result.push(ancestor);
          });
        }
      });

      return result;
    };

    let result = [];
    return _getAncestors(this.klass, result);
  }
}

// C:Core
// I:Impl
//
// C=>I=>M1=>M2=>C=>I=>M1=>M2
// C=>I=>M1=>M2=>M3=>C=>
function updateRueAncestorChain<T extends Function>(klass: T, rueModule: typeof RueModule) {
  const klassRueAncestors = new RueModuleAncestorController(klass);
  if (!klassRueAncestors.data) klassRueAncestors.create([]);

  const dupRueAncestors = Array.from(klassRueAncestors.data);
  let currentKlassLastAncestor = dupRueAncestors.pop();

  // not klass[RUE_LAST_ANCESTOR_MODULE]
  // Even if you refer to it directly, you will see what is inherited.
  if (
    klassRueAncestors.data.length > 0 &&
    currentKlassLastAncestor &&
    currentKlassLastAncestor[RUE_MODULE]
  ) {
    if (!klassRueAncestors.data.includes(rueModule)) {
      klassRueAncestors.create([rueModule]);
    }
  } else {
    const rueAncestorLength = klassRueAncestors.data.length;

    if (rueAncestorLength == 0) {
      klassRueAncestors.create([rueModule]);
    } else {
      for (let i = 0; i < rueAncestorLength; i++) {
        let currentKlassAncestor = klassRueAncestors.data[i];
        if (!currentKlassAncestor[RUE_MODULE]) {
          if (!klassRueAncestors.data.includes(rueModule)) {
            const newRueAncestors = klassRueAncestors.data;
            newRueAncestors.splice(i + 1, 0, rueModule);
            klassRueAncestors.update(newRueAncestors);
          }
          break;
        }
        if (i == rueAncestorLength - 1) {
          if (!klassRueAncestors.data.includes(rueModule)) {
            klassRueAncestors.create([rueModule]);
          }
        }
      }
    }
  }
}
