// rue packages
import { RueModule } from '@rue/activesupport';

// locals
import { ErrCodes, errObj } from '@/errors';
import { ActiveRecord$Base, RECORD_ALL } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';

// types
import type * as at from '@/records/modules/associations';

export class ActiveRecord$Core extends RueModule {
  /**
   * @see https://github.com/rails/rails/blob/5aaaa1630ae9a71b3c3ecc4dc46074d678c08d67/activerecord/lib/active_record/core.rb#L322-L339
   */
  static find<T extends ActiveRecord$Base>(...primaryKeys: at.Associations$PrimaryKey[]): T | T[] {
    if (primaryKeys.length == 0) {
      throw errObj({
        code: ErrCodes.RECORD_NOT_FOUND,
        message: `Could'nt find '${this.name}' without an 'primaryKey'`,
      });
    } else {
      const klassName = this.name;
      const allData = RecordCache.read<T[]>(klassName, RECORD_ALL, 'array');
      const filteredData = allData.filter((record) => primaryKeys.includes(record.primaryKey));
      if (filteredData.length === 0) {
        if (primaryKeys.length === 1) {
          throw errObj({
            code: ErrCodes.RECORD_NOT_FOUND,
            params: {
              resource: this.name,
              primaryKey: primaryKeys[0],
            },
          });
        } else {
          throw errObj({
            code: ErrCodes.RECORD_NOT_FOUND,
            message: `Could't find all '${this.name}' with 'primaryKey': [${primaryKeys}] (found 0 results, but was looking for ${primaryKeys.length})`,
          });
        }
      } else if (filteredData.length === 1) {
        return filteredData[0];
      } else {
        return filteredData;
      }
    }
  }
}
