// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { registryForScopes as Registry } from '@/registries';
import { ActiveRecord$QueryMethods$WhereChain } from '@/records/modules/query_methods';

// types
import * as t from './types';

// this is bound to an instance(class) of ActiveRecord$Base
export class ActiveRecord$Associations$CollectionProxy extends RueModule {
  static scope<T extends ActiveRecord$Base>(scopeName: string, fn: (...args) => t.ScopeVal<T>) {
    Registry.create(this.name, 'scope', {
      [scopeName]: fn,
    });
    _resolveScopes(this);
  }
}

function _resolveScopes(klass: Function) {
  const allScopes = Registry.data[klass.name]['scope'];

  if (allScopes == undefined) return;

  Object.keys(allScopes).forEach((scopeName: string) => {
    const scopeFn = allScopes[scopeName];

    Object.defineProperty(klass, scopeName, {
      enumerable: true,
      configurable: false,
      value: (...args) => {
        const scopeVal = scopeFn(...args);
        if (scopeVal instanceof ActiveRecord$QueryMethods$WhereChain) {
          return scopeVal.toPromiseArray();
        } else {
          return scopeVal;
        }
      },
    });
  });
}
