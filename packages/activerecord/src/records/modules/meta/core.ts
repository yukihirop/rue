// rue packages
import { RueModule } from '@ruejs/activesupport';
import { cacheForRecords as RecordCache } from '@/registries';
import { RECORD_META } from '@/records/base';

export class ActiveRecord$Meta extends RueModule {
  static meta<T>(): Promise<T> {
    // @ts-expect-error
    const _this = this as ct.Constructor<T>;
    const cacheKey = _this.uniqueKey;
    const data = RecordCache.read<T>(cacheKey, RECORD_META, 'object');
    if (Object.keys(data).length !== 0) {
      return Promise.resolve(data);
    } else {
      return _this.fetchAll().then((data: { all?: any[]; meta: T[] }) => {
        const result = data.meta || {};
        RecordCache.create(cacheKey, RECORD_META, result);
        return result;
      });
    }
  }
}
