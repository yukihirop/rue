// locals
import { RueModule, RueModuleAncestorController } from '@/modules';

// types
import * as t from './types';

const BUILTIN_METHODS = ['constructor', 'length', 'name'];

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
    const removeBuiltinMethodsFilter = (name: string) => !BUILTIN_METHODS.includes(name);

    const getOwnMethods = (obj: Function | RueModule) => {
      return Object.entries(Object.getOwnPropertyDescriptors(obj))
        .filter(([name, { value }]) => typeof value === 'function')
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
          .filter(skipImplClassFilter(obj as Function))
          .filter(removeBuiltinMethodsFilter),
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
    const { RUE_MODULE } = RueModule;

    // @important
    // RueModule's ancestor chain and JavaScript prototype chain are not related.
    // Therefore you have to reassemble the chain yourself

    const _getAncestors = <T>(f: Function, ancestors: T[]) => {
      const proto = Object.getPrototypeOf(f);

      if (proto == null) return ancestors;
      const fRueModuleAncestors = new RueModuleAncestorController(f);

      if (fRueModuleAncestors.data.length > 0) {
        fRueModuleAncestors.ancestors().forEach((ancestor: T) => {
          const proto = Object.getPrototypeOf(ancestor);
          if (proto.__rue_abstract_class__) {
            const controller = new RueModuleAncestorController(proto);
            const willAddAncestors = [ancestor, ...controller.ancestors()];
            willAddAncestors.forEach((childAncestor: T) => {
              if (!ancestors.includes(childAncestor)) ancestors.push(childAncestor);
            });
          } else {
            if (!ancestors.includes(ancestor)) ancestors.push(ancestor);
          }
        });
        return _getAncestors(proto, ancestors);
      } else {
        if (f && f['name'] && !ancestors.includes(f as any)) ancestors.push(f as any);
        return _getAncestors(proto, ancestors);
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
    let useTransformer;
    if (transformer) {
      useTransformer = transformer;
      ancestors = _getAncestors(target, ancestors);
    } else {
      useTransformer = defaultTransformer;
      ancestors = _getAncestors(target, ancestors);
    }

    // Add base class to ancestors
    const funcAncs = Function.prototype;
    const objAncs = Object.prototype;
    if (!ancestors.includes(funcAncs)) ancestors.push(funcAncs);
    if (!ancestors.includes(objAncs)) ancestors.push(objAncs);

    return ancestors.map(useTransformer);
  }
}
