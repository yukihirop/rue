// rue packages
import { Support } from '@rue/activesupport';

// locals
import { Record } from '@/records';
import { registryForScopes as Registry } from '@/registries';
import { Filter$WhereChain } from '@/filters';

// types
import * as t from './types';

// this is bound to an instance(class) of Association
export const CollectionProxy = Support.defineRueModule(
  'ActiveRecord$Associations$CollectionProxy',
  {
    static: {
      scope<T extends Record>(scopeName: string, fn: (...args) => t.ScopeVal<T>) {
        Registry.create(this.name, 'scope', {
          [scopeName]: fn,
        });
        CollectionProxy.static._resolveScopes(this);
      },

      _resolveScopes(klass: Function) {
        const allScopes = Registry.data[klass.name]['scope'];

        if (allScopes == undefined) return;

        Object.keys(allScopes).forEach((scopeName: string) => {
          const scopeFn = allScopes[scopeName];

          Object.defineProperty(klass, scopeName, {
            enumerable: true,
            configurable: false,
            value: (...args) => {
              const scopeVal = scopeFn(...args);
              if (scopeVal instanceof Filter$WhereChain) {
                return scopeVal.toPromiseArray();
              } else {
                return scopeVal;
              }
            },
          });
        });
      },
    },
  }
);
