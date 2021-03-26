// rue packages
import { RueModule } from '@rue/activesupport';

// local
import { cacheForRecords as RecordCache } from '@/registries';
import { ActiveRecord$Base, RECORD_ALL, RUE_AUTO_INCREMENT_RECORD_ID } from '@/records/base';
import { ActiveRecord$Relation, ActiveRecord$Relation$Holder as Holder } from '@/records/relations';
import { registryForScopes as ScopeRegistry } from '@/registries';
import { clone } from '@/utils';

// types
import type * as t from './types';
import type * as ct from '@/types';
import type * as rt from '@/registries/types';
import type * as art from '@/records/relations/types';

export class ActiveRecord$Scoping$Named extends RueModule {
  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Scoping/Named/ClassMethods.html#method-i-all
   */
  static all<T extends ActiveRecord$Base>(): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ct.Constructor<T>;
    const klassName = _this.name;

    const aid = RecordCache.read<number>(klassName, RUE_AUTO_INCREMENT_RECORD_ID, 'value');
    if (aid != 1 && aid != undefined) {
      const scope = RecordCache.read<T[]>(klassName, RECORD_ALL, 'array');
      // Must pass a copy
      const holder = new Holder<T>(_this, Array.from(scope));
      const relation = createRuntimeRelation<T, Holder<T>>((resolve, _reject) => {
        // Must pass a copy
        resolve({ holder, scope: Array.from(scope) });
      }, _this);

      return relation;
    } else {
      const relation = createRuntimeRelation<T, Holder<T>>((resolve, _reject) => {
        const scope = _this
          // fetchAll is defined in ActiveRecord$Base but is protected so I get a typescript error.
          // @ts-expect-error
          .fetchAll()
          .then((data) => {
            const records = data.map((d) => {
              const record = new _this(d);

              record.saveSync();

              return clone(record);
            }) as Array<T>;
            return Array.from(records);
          });
        const holder = new Holder<T>(_this, []);
        resolve({ holder, scope });
      }, _this);

      return relation;
    }
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Scoping/Named/ClassMethods.html#method-i-scope
   */
  static scope<T extends ActiveRecord$Base>(
    scopeName: string,
    fn: (self: ct.Constructor<T>, ...args) => t.ScopeVal<T>
  ) {
    // @ts-expect-error
    const _this = this as ct.Constructor<T>;

    const scopeData = ScopeRegistry.read<rt.Scopes>(_this.name, 'scope', 'object');
    if (scopeData[scopeName]) return;

    ScopeRegistry.create(_this.name, 'scope', {
      [scopeName]: fn,
    });

    defineScope<T>(_this, scopeName);
  }
}

function createRuntimeRelation<T extends ActiveRecord$Base, H extends Holder<T>>(
  executor: art.PromiseExecutor<T, H>,
  recordKlass: ct.Constructor<T>
): ActiveRecord$Relation<T> {
  const runtimeKlassName = `${recordKlass.name}$ActiveRecord_Relation`;
  const runtimeKlass = {
    [runtimeKlassName]: class extends ActiveRecord$Relation<T> {},
  }[runtimeKlassName];

  // @ts-expect-error
  return new runtimeKlass(executor)._init(recordKlass);
}

function defineScope<T extends ActiveRecord$Base>(klass: ct.Constructor<T>, scopeName: string) {
  // @ts-expect-error
  const scopeFn = ScopeRegistry.data[klass.name]['scope'][scopeName] as (
    self: ct.Constructor<T>,
    ...args: any[]
  ) => Promise<T[]>;

  if (scopeFn == undefined) return;

  Object.defineProperty(klass, scopeName, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: (...args) => {
      const scopeVal = scopeFn(klass, ...args);
      return scopeVal;
    },
  });
}
