// rue packages
import { RueModule } from '@rue/activesupport';

// local
import { cacheForRecords as Cache } from '@/registries';
import { ActiveRecord$Base, RECORD_ALL } from '@/records/base';
import { ActiveRecord$Relation } from '@/records/relations';

// types
import * as cf from '@/types';

export class ActiveRecord$Scoping$Named extends RueModule {
  static all<T extends ActiveRecord$Base>(): Promise<ActiveRecord$Relation<T>> {
    // @ts-ignore
    const _this = this as ct.Constructor<T>;
    const klassName = _this.name;

    if (Cache.read<T[]>(klassName, RECORD_ALL, 'array').length > 0) {
      const records = Cache.read<T[]>(klassName, RECORD_ALL, 'array');
      const relation = new ActiveRecord$Relation<T>(_this, records);
      return Promise.resolve(relation);
    } else {
      return new Promise((resolve, reject) => {
        _this
          // @ts-ignore
          .fetchAll<T>()
          .then((data) => {
            const records = data.map((d) => {
              const record = new _this(d);

              record.save();

              return record;
            }) as Array<T>;

            const relation = new ActiveRecord$Relation<T>(_this, records);
            return resolve(relation);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  }
}
