// types
import * as t from './types';

export class ActiveSupport$Registry$Base<T> {
  public registryName: string;
  public data: t.RegistryData<T>;

  constructor(registryName: string) {
    this.registryName = registryName;
    this.data = {} as t.RegistryData<T>;
  }

  create(klassName: string, key: string, val: t.RegistryValue) {
    if (Array.isArray(val)) {
      this.ensure(klassName, key, 'array');
      this.data[klassName][key].push(...val);
    } else if (typeof val === 'object' && val != null) {
      this.ensure(klassName, key, 'object');
      Object.keys(val).forEach((dataKey) => {
        const dataValue = val[dataKey];
        this.data[klassName][key][dataKey] = dataValue;
      });
    } else {
      this.ensure(klassName, key, 'value');
      this.data[klassName][key] = val;
    }
  }

  update(klassName: string, key: string, val: t.RegistryValue) {
    if (Array.isArray(val)) {
      this.ensure(klassName, key, 'array');
      const beforeRegistryData = this.data[klassName][key];
      this.data[klassName][key].splice(0, beforeRegistryData.length, ...val);
    } else if (typeof val === 'object' && val != null) {
      this.ensure(klassName, key, 'object');
      Object.keys(val).forEach((dataKey) => {
        const dataValue = val[dataKey];
        this.data[klassName][key][dataKey] = dataValue;
      });
    } else {
      this.ensure(klassName, key, 'value');
      this.data[klassName][key] = val;
    }
  }

  read<U>(klassName: string, key: string, ensureType?: t.RegistryType): U {
    if (ensureType) this.ensure(klassName, key, ensureType);
    if (this.data[klassName] == undefined) return undefined;
    return this.data[klassName][key];
  }

  destroy(klassName: string) {
    this.data[klassName] = {} as T;
  }

  private ensure(klassName, key: string, type: t.RegistryType) {
    if (this.data[klassName] == undefined) {
      this.data[klassName] = {} as T;
    }

    if (this.data[klassName][key] == undefined) {
      if (type == 'array') {
        this.data[klassName][key] = [];
      } else if (type == 'object') {
        this.data[klassName][key] = {};
      } else if (type == 'value') {
        this.data[klassName][key] = undefined;
      }
    }
  }
}

/**
 * define singleton
 */

// types
import type * as mt from '@/modules';

export const registryForRueModule = new ActiveSupport$Registry$Base<mt.RueModuleAncestors>(
  'RueModuleAncestors'
);

const innerRegistryForRueClassName = new ActiveSupport$Registry$Base<string[]>('RueClassNames');
export class registryForRueClassName {
  private static readonly klassName = 'RueClassNames';
  private static readonly key = 'all';

  static create(val: t.RegistryValue) {
    innerRegistryForRueClassName.create(this.klassName, this.key, val);
  }

  static update(val: t.RegistryValue) {
    innerRegistryForRueClassName.update(this.klassName, this.key, val);
  }

  static read<T>(ensureType?: t.RegistryType): T {
    return innerRegistryForRueClassName.read<T>(this.klassName, this.key, ensureType);
  }
}
