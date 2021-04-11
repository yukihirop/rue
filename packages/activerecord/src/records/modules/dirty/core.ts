// rue packages
import { RueModule } from '@ruejs/activesupport';

// locals
import { ActiveRecord$Base } from '@/records';
import { cacheForRecords as RecordCache } from '@/registries';

export class ActiveRecord$Dirty extends RueModule {
  /**
   * @see https://api.rubyonrails.org/classes/ActiveModel/Dirty.html#method-i-changed-3F
   */
  isChanged(): boolean {
    // @ts-expect-error
    const _this = this as ActiveRecord$Base;
    const { RECORD_ALL, RUE_RECORD_ID } = ActiveRecord$Base;
    const cacheKey = _this.uniqueKey;
    const records = RecordCache.read<ActiveRecord$Base[]>(cacheKey, RECORD_ALL, 'array');
    const isBlankRecord = Object.values(_this.attributes()).every((v) => v === undefined);

    if (records.length === 0) {
      return isBlankRecord ? false : true;
    } else {
      const rueRecordId = _this[RUE_RECORD_ID];
      const foundRecord = records.filter((record) => record[RUE_RECORD_ID] === rueRecordId)[0];
      if (foundRecord) {
        return JSON.stringify(_this.attributes()) != JSON.stringify(foundRecord.attributes());
      } else {
        return isBlankRecord ? false : true;
      }
    }
  }
}
