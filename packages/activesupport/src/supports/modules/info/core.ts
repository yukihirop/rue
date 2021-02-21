// types
import * as mt from '@/modules';
import * as t from './types';

// this is bound to an instance(class) of Support
const Info: mt.Module = {
  isModule: true,

  // https://qiita.com/suin/items/b807769388c54c57a8be
  // @static
  getMethods(obj?: Function): string[] {
    let target = new this();
    if (obj) target = obj;

    const getOwnMethods = (obj: object) =>
      Object.entries(Object.getOwnPropertyDescriptors(obj))
        .filter(([name, { value }]) => typeof value === 'function' && name !== 'constructor')
        .map(([name]) => name);

    const _getMethods = (o: object, methods: string[]): string[] =>
      o === Object.prototype || o == null
        ? methods
        : _getMethods(Object.getPrototypeOf(o), methods.concat(getOwnMethods(o)));

    return _getMethods(target, []);
  },

  // @static
  // Support Rue Module
  getMethodsWithNamespace(obj?: Function | object): t.MethodWithNamespace[] {
    let target = new this();
    if (obj) target = obj;

    if (typeof target === 'function') {
      return Info._getStaticMethodsWithNamespace(this, obj);
    } else if (typeof target === 'object') {
      return Info._getInstanceMethodsWithNamespace(this, obj);
    } else {
      return Info._getInstanceMethodsWithNamespace(this, obj);
    }
  },

  // @static
  getProperties(obj: Function): string[] {
    let target = new this();
    if (obj) target = obj;

    const descriptors = Object.getOwnPropertyDescriptors(target);
    return Object.keys(descriptors);
  },

  // @static
  _getStaticMethodsWithNamespace(self: any, obj?: Function): t.MethodWithNamespace[] {
    let target = new self();
    if (obj) target = obj;

    const getOwnMethods = (obj: any): t.MethodWithNamespace => {
      return Object.entries(Object.getOwnPropertyDescriptors(obj))
        .filter(([name, { value }]) => typeof value === 'function' && name !== 'constructor')
        .reduce((acc, [name]) => {
          let namespace = '';

          // static method in Module
          if (obj['__rue_module__']) {
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
      if (o && o['__rue_module__']) {
        return _getMethods(
          Info._getAncestorRueModuleOf(o),
          Object.assign(methods, getOwnMethods(o))
        );
      } else {
        if (o == Object.prototype || o == null) {
          return methods;
        } else {
          // End point class inheriting rue module
          const isInheritRueModuleEndPointClass = Object.keys(o).includes(
            '__rue_ancestor_module__'
          );
          if (isInheritRueModuleEndPointClass) {
            return _getMethods(
              Info._getAncestorRueModuleOf(o),
              Object.assign(methods, getOwnMethods(o))
            );
          } else {
            return _getMethods(Object.getPrototypeOf(o), Object.assign(methods, getOwnMethods(o)));
          }
        }
      }
    };

    // @ts-ignore
    return _getMethods(target, {} as t.MethodWithNamespace);
  },

  // @static
  _getInstanceMethodsWithNamespace(self: any, obj?: object): t.MethodWithNamespace[] {
    let target = new self();
    if (obj) target = obj;

    const getOwnMethods = (obj: object): t.MethodWithNamespace => {
      return Object.entries(Object.getOwnPropertyDescriptors(obj))
        .filter(([name, { value }]) => typeof value === 'function' && name !== 'constructor')
        .reduce((acc, [name]) => {
          let namespace = '';

          // instance method in Module
          if (obj.constructor['__rue_module__']) {
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
      if (o && o.constructor['__rue_module__']) {
        return _getMethods(
          Info._getAncestorRueModuleOf(o.constructor),
          Object.assign(methods, getOwnMethods(o.constructor['prototype']))
        );
      } else if (o && o['__rue_module__']) {
        return _getMethods(
          Info._getAncestorRueModuleOf(o),
          Object.assign(methods, getOwnMethods(o['prototype']))
        );
      } else {
        if (o == Object.prototype || o == null) {
          return methods;
        } else {
          // End point class inheriting rue module
          const isInheritRueModuleEndPointClass = Object.keys(o.constructor).includes(
            '__rue_ancestor_module__'
          );
          if (isInheritRueModuleEndPointClass) {
            const ancestorModule = Info._getAncestorRueModuleOf(o.constructor);

            return _getMethods(
              Object.getPrototypeOf(new ancestorModule()),
              Object.assign(methods, getOwnMethods(o.constructor.prototype))
            );
          } else {
            return _getMethods(Object.getPrototypeOf(o), Object.assign(methods, getOwnMethods(o)));
          }
        }
      }
    };

    // @ts-ignore
    return _getMethods(target, {} as t.MethodWithNamespace);
  },

  _getAncestorRueModuleOf(klass: Function): Function {
    return klass['__rue_ancestor_module__'];
  },
};

export { Info };
