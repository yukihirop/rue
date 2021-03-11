// rue packages
import { RueModule } from '@rue/activesupport';

// local
import { cacheForRecords as RecordCache } from '@/registries';
import { ActiveRecord$Base, RECORD_ALL } from '@/records/base';
import { ActiveRecord$Relation } from '@/records/relations';

// types
import type * as ct from '@/types';

export class ActiveRecord$Scoping$Named extends RueModule {
  static all<T extends ActiveRecord$Base>(): Promise<ActiveRecord$Relation<T>> {
    // @ts-expect-error
    const _this = this as ct.Constructor<T>;
    const klassName = _this.name;

    if (RecordCache.read<T[]>(klassName, RECORD_ALL, 'array').length > 0) {
      const records = RecordCache.read<T[]>(klassName, RECORD_ALL, 'array');
      // records passed by value
      const relation = new ActiveRecord$Relation<T>(_this, Array.from(records));
      return Promise.resolve(relation);
    } else {
      return new Promise((resolve, reject) => {
        _this
          // fetchAll is defined in ActiveRecord$Base but is protected so I get a typescript error.
          // @ts-expect-error
          .fetchAll()
          .then((data) => {
            const records = data.map((d) => {
              const record = new _this(d);

              record.save();

              return record;
            }) as Array<T>;

            // records passed by value
            const relation = createRuntimeRelation<T>(_this, Array.from(records));
            return resolve(relation);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  }
}

function createRuntimeRelation<T extends ActiveRecord$Base>(
  recordKlass: ct.Constructor<T>,
  records: T[]
): ActiveRecord$Relation<T> {
  const runtimeKlassName = `${recordKlass.name}$ActiveRecord_Relation`;
  const runtimeKlass = {
    [runtimeKlassName]: class extends ActiveRecord$Relation<T> {},
  }[runtimeKlassName];

  return new runtimeKlass(recordKlass, records);
}
