import { ActiveRecord$Base as Record, RECORD_META } from '../base';
import { cacheForRecords as RecordCache } from '@/registries';

// types
import type * as t from '@/index';

type MetaRecordParams = {
  id: t.Record$PrimaryKey;
  name: string;
  age: number;
};

type MetaRecordMetaPrams = {
  recordsCount: number;
};

class MetaRecord extends Record<MetaRecordParams> {
  public id: MetaRecordParams['id'];
  public name: MetaRecordParams['name'];
  public age: MetaRecordParams['age'];

  protected fetchAll(): Promise<{ all?: MetaRecordParams[]; meta?: any }> {
    return Promise.resolve({
      meta: {
        recordsCount: 5,
      },
    });
  }

  get uniqueKey(): string {
    return 'MetaRecord';
  }
}

describe('ActiveRecord$Meta', () => {
  describe('[static] meta', () => {
    describe('when do not exists cahce', () => {
      it('should correctly', (done) => {
        MetaRecord.meta<MetaRecordMetaPrams>().then((data: MetaRecordMetaPrams) => {
          expect(data).toEqual({ recordsCount: 5 });
          expect(RecordCache.data[MetaRecord.uniqueKey][RECORD_META]).toEqual({ recordsCount: 5 });
          done();
        });
      });
    });
  });
});
