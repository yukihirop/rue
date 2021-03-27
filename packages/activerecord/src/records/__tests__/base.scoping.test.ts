import { ActiveRecord$Base as Record, RECORD_ALL } from '../base';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

type ScopingRecordParams = {
  id: t.Record$PrimaryKey;
  name: string;
  age: number;
};

class ScopingRecord extends Record<ScopingRecordParams> {
  public id: ScopingRecordParams['id'];
  public name: ScopingRecordParams['name'];
  public age: ScopingRecordParams['age'];

  protected fetchAll(): Promise<ScopingRecordParams[]> {
    return Promise.resolve([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
    ]);
  }

  get uniqueKey(): string {
    return 'ScopingRecord';
  }
}

describe('Record (Scoping)', () => {
  beforeEach(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('[static] all', () => {
    describe('when do not exists cahce', () => {
      it('should correctly', (done) => {
        ScopingRecord.all<ScopingRecord>().then((records: ScopingRecord[]) => {
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
          expect(RecordCache.data[ScopingRecord.name][RECORD_ALL]).toEqual([
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
          done();
        });
      });
    });
  });

  describe('[static] scope', () => {
    class StaticScopeRecord extends ScopingRecord {
      public static fromName: t.Record$Scope<StaticScopeRecord>;
      public static fromAge: t.Record$Scope<StaticScopeRecord>;

      get uniqueKey(): string {
        return 'StaticScopeRecord';
      }
    }

    StaticScopeRecord.scope<StaticScopeRecord>('fromName', (self, name) => self.where({ name }));
    StaticScopeRecord.scope<StaticScopeRecord>('fromAge', (self, ...ages) =>
      self.where({ age: ages })
    );

    describe('when default', () => {
      it('should correctly', (done) => {
        StaticScopeRecord.fromName('name_1').then((records) => {
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
          ]);
          done();
        });
        StaticScopeRecord.fromAge(1, 2).then((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
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
              __rue_record_id__: 4,
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
          done();
        });
      });
    });
  });
});
