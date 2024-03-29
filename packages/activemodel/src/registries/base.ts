// rue packages
import { Registry } from '@ruejs/activesupport';

// types
import type * as st from '@ruejs/activesupport';
import type * as t from './types';

// define singletons
const registryForValidations = new Registry<t.Validations>('Validations');

const innerRegistryForUniqueKeys = new Registry<string[]>('RueClassNames');
class registryForUniqueKeys {
  private static readonly klassName = 'RueUniqueKey';
  private static readonly key = 'all';

  static create(val: st.Registry$Value) {
    innerRegistryForUniqueKeys.create(this.klassName, this.key, val);
  }

  static update(val: st.Registry$Value) {
    innerRegistryForUniqueKeys.update(this.klassName, this.key, val);
  }

  static read<T>(ensureType?: st.Registry$Type): T {
    return innerRegistryForUniqueKeys.read<T>(this.klassName, this.key, ensureType);
  }
}

// prettier-ignore
export { registryForValidations, registryForUniqueKeys };
