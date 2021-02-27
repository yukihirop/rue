// locals
import { RueModule } from '@/modules';

// types
import * as t from './types';

// this is bound to an instance(class) of Support
export class ActiveSupport$Info extends RueModule {
  // Support Rue Module
  // https://qiita.com/suin/items/b807769388c54c57a8be
  static getMethodsWithNamespace(obj?: Function | object | RueModule): t.MethodWithNamespace[] {
    const { RUE_MODULE, RUE_ABSTRACT_CLASS } = RueModule;

    const publicOnlyFilter = (name: string) => !name.startsWith('_');
    const removePrototypeFilter = (obj: Function) => (name: string) =>
      obj.name != '' ? name != 'prototype' : true;
    const skipImplClassFilter = (obj: Function) => (name: string) =>
      obj.hasOwnProperty(RUE_ABSTRACT_CLASS) ? false : true;

    const getOwnMethods = (obj: Function | RueModule) => {
      return Object.entries(Object.getOwnPropertyDescriptors(obj))
        .filter(([name, { value }]) => typeof value === 'function' && name !== 'constructor')
        .map(([name]) => name);
    };

    const transformerFn = (isInstance: boolean) => (obj: Function | RueModule) => {
      let klassOrModuleName;
      let methods;

      if (obj[RUE_MODULE]) {
        klassOrModuleName = `${obj['name']} (RueModule)`;

        if (isInstance) {
          methods = Object.keys(Object.getOwnPropertyDescriptors(obj['prototype']) || []);
        } else {
          methods = Object.keys(Object.getOwnPropertyDescriptors(obj) || []);
        }
      } else {
        klassOrModuleName = obj['name'];

        if (isInstance) {
          methods = getOwnMethods(obj.constructor);
        } else {
          methods = getOwnMethods(obj);
        }
      }

      // https://stackoverflow.com/questions/56659303/what-is-base-object-in-javascript
      // cosmetic namespace
      if (klassOrModuleName === '') {
        klassOrModuleName = 'Function';
      } else if (klassOrModuleName === undefined) {
        klassOrModuleName = 'Object';
      }

      // prettier-ignore
      return {
          [klassOrModuleName]: methods
            .filter(publicOnlyFilter)
            .filter(removePrototypeFilter(obj as Function))
            .filter(skipImplClassFilter(obj as Function)),
        };
    };

    // main

    const target = obj ? obj : this;
    const isInstance = typeof target === 'object' ? true : false;

    return this.getAncestors(target, transformerFn(isInstance)).reduce((acc, item) => {
      Object.assign(acc, item);
      return acc;
    }, {} as any);
  }

  static getProperties(obj: Function): string[] {
    let target = new (this as any)();
    if (obj) target = obj;

    const descriptors = Object.getOwnPropertyDescriptors(target);
    return Object.keys(descriptors);
  }

  static getAncestors<T = string>(
    obj?: Function | object,
    transformer?: (obj: Function) => T
  ): T[] {
    const { RUE_MODULE, RUE_ANCESTORS } = RueModule;

    const _getAncestors = <T>(
      f: Function,
      ancestors: T[],
      transformer: (obj: Function | object) => T
    ) => {
      const proto = Object.getPrototypeOf(f);

      if (proto == null) {
        const funcAncs = transformer(Function.prototype);
        const objAncs = transformer(Object.prototype);
        if (!ancestors.includes(funcAncs)) ancestors.push(funcAncs);
        if (!ancestors.includes(objAncs)) ancestors.push(objAncs);
        return ancestors;
      }

      // not f[RUE_ANCESTOR]
      // Even if you refer to it directly, you will see what is inherited.
      if (f.hasOwnProperty(RUE_ANCESTORS)) {
        if (f === RueModule) {
          // If you don't change the order, it looks like it is included or extended in the base module RueModule.
          ancestors.push(...f[RUE_ANCESTORS].map(transformer));
          const rueModule = transformer(f);
          if(!ancestors.includes(rueModule)) ancestors.push(rueModule);
        } else {
          ancestors.push(transformer(f));
          ancestors.push(...f[RUE_ANCESTORS].map(transformer));
        }
        return _getAncestors(proto, ancestors, transformer);
      } else {
        ancestors.push(transformer(f));
        return _getAncestors(proto, ancestors, transformer);
      }
    };

    const defaultTransformer = (obj: Function): string => {
      let ancestorName;

      if (obj[RUE_MODULE]) {
        ancestorName = `${obj['name']} (RueModule)`;
      } else {
        ancestorName = obj['name'];
      }

      // https://stackoverflow.com/questions/56659303/what-is-base-object-in-javascript
      // cosmetic namespace
      if (ancestorName === '') {
        ancestorName = 'Function';
      } else if (ancestorName === undefined) {
        ancestorName = 'Object';
      }

      return ancestorName;
    };

    let target;
    if (obj) {
      target = obj;
      if (typeof obj === 'object') target = obj.constructor;
    } else {
      target = this;
      // @ts-ignore
      if (typeof this === 'object') target = this.constructor;
    }

    let ancestors = [];
    if (transformer) {
      return _getAncestors(target, ancestors, transformer);
    } else {
      return _getAncestors(target, ancestors, defaultTransformer);
    }
  }
}
