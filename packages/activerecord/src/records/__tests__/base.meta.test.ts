import { ActiveRecord$Base as Record, RECORD_ALL, RECORD_META } from '../base';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import MockDate from 'mockdate';

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
      all: [
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
      ],
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
  beforeEach(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

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

  describe('[static] recordsWithMeta', () => {
    describe('when do not exists cache', () => {
      it('should correctly', (done) => {
        MetaRecord.recordsWithMeta<MetaRecord, MetaRecordMetaPrams>().then(([records, meta]) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              id: 1,
              name: 'name_1',
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              id: 2,
              name: 'name_2',
            },
          ]);
          expect(meta).toEqual({ recordsCount: 5 });
          expect(RecordCache.data[MetaRecord.uniqueKey][RECORD_ALL]).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              id: 1,
              name: 'name_1',
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _associationCache: {},
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              id: 2,
              name: 'name_2',
            },
          ]);
          expect(RecordCache.data[MetaRecord.uniqueKey][RECORD_META]).toEqual({ recordsCount: 5 });
          done();
        });
      });
    });
  });
});
