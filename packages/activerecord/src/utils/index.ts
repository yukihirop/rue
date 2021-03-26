export function isPresent(params: any): boolean {
  if (typeof params === 'number') {
    return params >= 0;
  } else if (Array.isArray(params)) {
    return params.length > 0;
  } else if (typeof params === 'object' && params !== null) {
    return params && Object.keys(params).length > 0;
  } else {
    return false;
  }
}

// https://qiita.com/toshihikoyanase/items/7b07ca6a94eb72164257
export function isSuperset(target: string[], other: string[]): boolean {
  const self = new Set(target);
  const subset = new Set(other);
  for (let elem of subset) {
    if (!self.has(elem)) {
      return false;
    }
  }
  return true;
}

export function clone<T>(original: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(original)), original);
}
