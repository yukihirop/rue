// locals
import { defineRueModule } from '@/modules';
import { RUE_MODULE, RUE_ANCESTOR } from '@/modules/core';

// types
import * as mt from '@/modules';
import * as t from './types';

// this is bound to an instance(class) of Support
export const Info = defineRueModule('ActiveSupport$Info', {
  static: {
    // https://qiita.com/suin/items/b807769388c54c57a8be
    getMethods(obj?: Function): string[] {
      let target = new this();
      if (obj) target = obj;

      const getOwnMethods = (obj: object) =>
        Object.entries(Object.getOwnPropertyDescriptors(obj))
          .filter(([name, { value }]) => typeof value === 'function' && name !== 'constructor')
          .filter(([name]) => !name.startsWith('_'))
          .map(([name]) => name);

      const _getMethods = (o: object, methods: string[]): string[] =>
        o === Object.prototype || o == null
          ? methods
          : _getMethods(Object.getPrototypeOf(o), methods.concat(getOwnMethods(o)));

      return _getMethods(target, []);
    },

    // Support Rue Module
    getMethodsWithNamespace(obj?: Function | object): t.MethodWithNamespace[] {
      let target = new this();
      if (obj) target = obj;

      if (typeof target === 'function') {
        return Info.static._getStaticMethodsWithNamespace(this, obj);
      } else if (typeof target === 'object') {
        return Info.static._getInstanceMethodsWithNamespace(this, obj);
      } else {
        return Info.static._getInstanceMethodsWithNamespace(this, obj);
      }
    },

    getProperties(obj: Function): string[] {
      let target = new this();
      if (obj) target = obj;

      const descriptors = Object.getOwnPropertyDescriptors(target);
      return Object.keys(descriptors);
    },

    getAncestors<T = string>(obj?: Function | object, transformer?: (obj: Function) => T): T[] {
      const _getAncestors = <T>(f: Function, ancestors: T[], transformer: (obj: Function) => T) => {
        // not f[RUE_ANCESTOR]
        // Even if you refer to it directly, you will see what is inherited.
        if (f.hasOwnProperty(RUE_ANCESTOR)) {
          const maybeRueModule = f[RUE_ANCESTOR];

          if (maybeRueModule == Object) {
            return ancestors;
          } else if (maybeRueModule) {
            ancestors.push(transformer(maybeRueModule));
            return _getAncestors(maybeRueModule, ancestors, transformer);
          }
        } else {
          const proto = Object.getPrototypeOf(f);
          if (proto == null) {
            return ancestors;
          } else {
            ancestors.push(transformer(proto));
            return _getAncestors(proto, ancestors, transformer);
          }
        }
      };

      const defaultTransformer = (obj: Function): string => {
        let ancestorName;

        if (obj[RUE_MODULE]) {
          ancestorName = `${obj['name']} (Module)`;
        } else {
          ancestorName = obj['name'];
        }

        // https://stackoverflow.com/questions/56659303/what-is-base-object-in-javascript
        // cosmetic namespace
        if (ancestorName === '') {
          ancestorName = 'Function (prototype)';
        } else if (ancestorName === undefined) {
          ancestorName = 'Object (prototype)';
        }

        return ancestorName;
      };


      let target;
      if (obj) {
        target = obj;
        if (typeof obj === 'object') target = obj.constructor;
      } else {
        target = this;
        if (typeof this === 'object') target = this.constructor;
      }

      let ancestors;
      if (transformer) {
        ancestors = [transformer(target)];
        return _getAncestors(target, ancestors, transformer);
      } else {
        ancestors = [defaultTransformer(target)];
        return _getAncestors(target, ancestors, defaultTransformer);
      }
    },

    _getStaticMethodsWithNamespace(self: any, obj?: Function): t.MethodWithNamespace[] {
      let target = new self();
      if (obj) target = obj;

      const getOwnMethods = (obj: any): t.MethodWithNamespace => {
        return Object.entries(Object.getOwnPropertyDescriptors(obj))
          .filter(([name, { value }]) => typeof value === 'function' && name !== 'constructor')
          .filter(([name]) => !name.startsWith('_'))
          .reduce((acc, [name]) => {
            let namespace = '';

            // static method in Module
            if (obj[RUE_MODULE]) {
              namespace = `${obj['name']} (Module)`;
            } else {
              namespace = obj['name'];
            }

            // https://stackoverflow.com/questions/56659303/what-is-base-object-in-javascript
            // cosmetic namespace
            if (namespace === '') {
              namespace = 'Function (prototype)';
            } else if (namespace === undefined) {
              namespace = 'Object (prototype)';
            }

            if (!acc[namespace]) acc[namespace] = [];
            acc[namespace].push(name);

            return acc;
          }, {});
      };

      const _getMethods = (o: any, methods: t.MethodWithNamespace[]): t.MethodWithNamespace[] => {
        if (o && o[RUE_MODULE]) {
          return _getMethods(
            Info.static._getAncestorRueModuleOf(o),
            Object.assign(methods, getOwnMethods(o))
          );
        } else {
          if (o == Object.prototype || o == null) {
            return methods;
          } else {
            // End point class inheriting rue module
            const isInheritRueModuleEndPointClass = Object.keys(o).includes(RUE_ANCESTOR);
            if (isInheritRueModuleEndPointClass) {
              return _getMethods(
                Info.static._getAncestorRueModuleOf(o),
                Object.assign(methods, getOwnMethods(o))
              );
            } else {
              return _getMethods(
                Object.getPrototypeOf(o),
                Object.assign(methods, getOwnMethods(o))
              );
            }
          }
        }
      };

      // @ts-ignore
      return _getMethods(target, {} as t.MethodWithNamespace);
    },

    _getInstanceMethodsWithNamespace(self: any, obj?: object): t.MethodWithNamespace[] {
      let target = new self();
      if (obj) target = obj;

      const getOwnMethods = (obj: object): t.MethodWithNamespace => {
        return Object.entries(Object.getOwnPropertyDescriptors(obj))
          .filter(([name, { value }]) => typeof value === 'function' && name !== 'constructor')
          .filter(([name]) => !name.startsWith('_'))
          .reduce((acc, [name]) => {
            let namespace = '';

            // instance method in Module
            if (obj.constructor[RUE_MODULE]) {
              namespace = `${obj.constructor.name} (Module)`;
            } else {
              namespace = obj.constructor.name;
            }

            // https://stackoverflow.com/questions/56659303/what-is-base-object-in-javascript
            // cosmetic namespace
            if (namespace === '') {
              namespace = 'Function (prototype)';
            } else if (namespace === undefined) {
              namespace = 'Object (prototype)';
            }

            if (!acc[namespace]) acc[namespace] = [];
            acc[namespace].push(name);

            return acc;
          }, {});
      };

      const _getMethods = (
        o: object | Function,
        methods: t.MethodWithNamespace[]
      ): t.MethodWithNamespace[] => {
        if (o && o.constructor[RUE_MODULE]) {
          return _getMethods(
            Info.static._getAncestorRueModuleOf(o.constructor),
            Object.assign(methods, getOwnMethods(o.constructor['prototype']))
          );
        } else if (o && o[RUE_MODULE]) {
          return _getMethods(
            Info.static._getAncestorRueModuleOf(o),
            Object.assign(methods, getOwnMethods(o['prototype']))
          );
        } else {
          if (o == Object.prototype || o == null) {
            return methods;
          } else {
            // End point class inheriting rue module
            const isInheritRueModuleEndPointClass = Object.keys(o.constructor).includes(
              RUE_ANCESTOR
            );
            if (isInheritRueModuleEndPointClass) {
              const ancestorModule = Info.static._getAncestorRueModuleOf(o.constructor);

              return _getMethods(
                Object.getPrototypeOf(new ancestorModule()),
                Object.assign(methods, getOwnMethods(o.constructor.prototype))
              );
            } else {
              return _getMethods(
                Object.getPrototypeOf(o),
                Object.assign(methods, getOwnMethods(o))
              );
            }
          }
        }
      };

      // @ts-ignore
      return _getMethods(target, {} as t.MethodWithNamespace);
    },

    _getAncestorRueModuleOf(klass: Function): Function {
      return klass[RUE_ANCESTOR];
    },
  },
});
