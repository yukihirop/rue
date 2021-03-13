// rue packages
import { RueModule } from '@rue/activesupport';

// local
import { cacheForRecords as RecordCache } from '@/registries';
import { ActiveRecord$Base, RECORD_ALL } from '@/records/base';
import { ActiveRecord$Relation, ActiveRecord$Relation$Holder as Holder } from '@/records/relations';

// types
import type * as ct from '@/types';
import type * as art from '@/records/relations/types';

export class ActiveRecord$Scoping$Named extends RueModule {
  static all<T extends ActiveRecord$Base>(): ActiveRecord$Relation<T> {
    // @ts-expect-error
    const _this = this as ct.Constructor<T>;
    const klassName = _this.name;

    if (RecordCache.read<T[]>(klassName, RECORD_ALL, 'array').length > 0) {
      const records = RecordCache.read<T[]>(klassName, RECORD_ALL, 'array');
      // records passed by value
      const relation = createRuntimeRelation<T>((resolve, _reject) => {
        resolve([new Holder(_this, Array.from(records)), Array.from(records)]);
      }, _this);

      return relation;
    } else {
      const relation = createRuntimeRelation<T>((resolve, _reject) => {
        const records = _this
          // fetchAll is defined in ActiveRecord$Base but is protected so I get a typescript error.
          // @ts-expect-error
          .fetchAll()
          .then((data) => {
            const records = data.map((d) => {
              const record = new _this(d);

              record.save();

              return record;
            }) as Array<T>;
            return Array.from(records);
          });
        resolve([new Holder(_this, []), records]);
      }, _this);

      return relation;
    }
  }
}

function createRuntimeRelation<T extends ActiveRecord$Base>(
  executor: art.PromiseExecutor<T>,
  recordKlass: ct.Constructor<T>
): ActiveRecord$Relation<T> {
  const runtimeKlassName = `${recordKlass.name}$ActiveRecord_Relation`;
  const runtimeKlass = {
    [runtimeKlassName]: class extends ActiveRecord$Relation<T> {},
  }[runtimeKlassName];

  // @ts-expect-error
  return new runtimeKlass(executor).init(recordKlass);
}
