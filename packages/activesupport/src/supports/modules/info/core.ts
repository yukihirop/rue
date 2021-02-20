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
      o === Object.prototype
        ? methods
        : _getMethods(Object.getPrototypeOf(o), methods.concat(getOwnMethods(o)));

    return _getMethods(target, []);
  },

  // @static
  getMethodsWithNamespace(obj?: Function): string[] {
    let target = new this();
    if (obj) target = obj;

    const getOwnMethods = (obj: object): t.MethodWithNamespace =>
      Object.entries(Object.getOwnPropertyDescriptors(obj))
        .filter(([name, { value }]) => typeof value === 'function' && name !== 'constructor')
        .reduce((acc, [name]) => {
          let namespace = '';

          if (obj.constructor.name === 'Function') {
            namespace = obj['name'];
          } else {
            if (obj['isModule']) {
              namespace = `${obj.constructor.name} (Module)`;
            } else {
              namespace = obj.constructor.name;
            }
          }

          if (!acc[namespace]) acc[namespace] = [];
          acc[namespace].push(name);

          return acc;
        }, {});

    const _getMethods = (o: object, methods: t.MethodWithNamespace[]): t.MethodWithNamespace[] =>
      o === Object.prototype
        ? methods
        : _getMethods(Object.getPrototypeOf(o), Object.assign(methods, getOwnMethods(o)));

    // @ts-ignore
    return _getMethods(target, {} as t.MethodWithNamespace);
  },

  // @static
  getProperties(obj: Function): string[] {
    let target = new this();
    if (obj) target = obj;

    const descriptors = Object.getOwnPropertyDescriptors(target);
    return Object.keys(descriptors);
  },
};

export { Info };
