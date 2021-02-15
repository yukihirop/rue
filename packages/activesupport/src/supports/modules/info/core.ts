import * as mt from '@/modules';

// this is bound to an instance(class) of Support
const Info: mt.Module = {
  isModule: true,

  // https://qiita.com/suin/items/b807769388c54c57a8be
  // @static
  getMethods(): string[] {
    const obj = new this();
    const getOwnMethods = (obj: object) =>
      Object.entries(Object.getOwnPropertyDescriptors(obj))
        .filter(([name, { value }]) => typeof value === 'function' && name !== 'constructor')
        .map(([name]) => name);
    const _getMethods = (o: object, methods: string[]): string[] =>
      o === Object.prototype
        ? methods
        : _getMethods(Object.getPrototypeOf(o), methods.concat(getOwnMethods(o)));
    return _getMethods(obj, []);
  },

  // @static
  getProperties(): string[] {
    const obj = new this();
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    return Object.keys(descriptors);
  },
};

export { Info };
