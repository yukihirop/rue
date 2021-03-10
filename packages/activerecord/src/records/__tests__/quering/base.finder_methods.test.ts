import { ActiveRecord$Base as Record, RECORD_ALL } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import MockDate from 'mockdate';

// types
import type * as at from '@/records/modules/associations';

type QueryingRecordParams = {
  primaryKey: at.Associations$PrimaryKey;
  name: string;
  age: number;
};

class QueryingRecord extends Record {
  public primaryKey: QueryingRecordParams['primaryKey'];
  public name: QueryingRecordParams['name'];
  public age: QueryingRecordParams['age'];

  protected static fetchAll<T = QueryingRecordParams>(): Promise<T[]> {
    return Promise.resolve([]);
  }

  static translate(key: string, opts?: any): string {
    return key;
  }
}

describe('ActiveRecord$Base (Querying) (delegate to FinderMethods)', () => {
  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeEach(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
    QueryingRecord.create([
      { primaryKey: 1, name: 'name_1', age: 1 },
      { primaryKey: 2, name: 'name_2', age: 2 },
      { primaryKey: 3, name: 'name_3', age: 3 },
    ]);
  });

  afterEach(() => {
    MockDate.reset();
    RecordCache.destroy(QueryingRecord.name);
  });

  describe('[static] findBy', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.findBy({ primaryKey: [1, 2] }).then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            primaryKey: 1,
          });
          done();
        });
      });
    });

    describe('when record not found', () => {
      it('should correctly', (done) => {
        QueryingRecord.findBy({ name: 'doNotExists' }).then((record) => {
          expect(record).toEqual(null);
          done();
        });
      });
    });
  });

  describe('[static] findByOrThrow', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.findByOrThrow({ primaryKey: [1, 2] }).then((records) => {
          expect(records).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            primaryKey: 1,
          });
          done();
        });
      });
    });

    describe('when throw error', () => {
      it('should correctly', (done) => {
        QueryingRecord.findByOrThrow({ name: 'doNotExists' }).catch((err) => {
          expect(err.toString()).toEqual("Error: Couldn't find 'QueryingRecord'");
          done();
        });
      });
    });
  });

  describe('[static] take', () => {
    describe('when default', () => {
      it('should return first record', (done) => {
        QueryingRecord.take<QueryingRecord>().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            primaryKey: 1,
          });
          done();
        });
      });
    });

    describe("when specify 'limit'", () => {
      it('should correctly', (done) => {
        QueryingRecord.take(2).then((record) => {
          expect(record).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              name: 'name_1',
              primaryKey: 1,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              primaryKey: 2,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'limit' over range", () => {
      it('should correctly', (done) => {
        QueryingRecord.take(100).then((record) => {
          expect(record).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              name: 'name_1',
              primaryKey: 1,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              primaryKey: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              name: 'name_3',
              primaryKey: 3,
            },
          ]);
          done();
        });
      });
    });

    describe('when record do not exist', () => {
      it('should return null', (done) => {
        RecordCache.destroy(QueryingRecord.name);
        QueryingRecord.take().then((record) => {
          expect(record).toEqual(null);
          done();
        });
      });
    });
  });

  describe('[static] takeOrThrow', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.takeOrThrow().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            primaryKey: 1,
          });
          done();
        });
      });
    });

    describe('when record not found', () => {
      it('should correctly', (done) => {
        RecordCache.destroy(QueryingRecord.name);
        QueryingRecord.takeOrThrow().catch((err) => {
          expect(err.toString()).toEqual("Error: Couldn't find 'QueryingRecord'");
          done();
        });
      });
    });
  });

  describe('[static] first', () => {
    describe('when default', () => {
      it('should return first record', (done) => {
        QueryingRecord.first<QueryingRecord>().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            primaryKey: 1,
          });
          done();
        });
      });
    });

    describe("when specify 'limit'", () => {
      it('should correctly', (done) => {
        QueryingRecord.first(2).then((record) => {
          expect(record).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              name: 'name_1',
              primaryKey: 1,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              primaryKey: 2,
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'limit' over range", () => {
      it('should correctly', (done) => {
        QueryingRecord.first(100).then((record) => {
          expect(record).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              name: 'name_1',
              primaryKey: 1,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              primaryKey: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              name: 'name_3',
              primaryKey: 3,
            },
          ]);
          done();
        });
      });
    });

    describe('when record do not exist', () => {
      it('should return null', (done) => {
        RecordCache.destroy(QueryingRecord.name);
        QueryingRecord.take().then((record) => {
          expect(record).toEqual(null);
          done();
        });
      });
    });
  });

  describe('#[static] firstOrThrow', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.firstOrThrow().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            primaryKey: 1,
          });
          done();
        });
      });
    });

    describe('when record not found', () => {
      it('should correctly', (done) => {
        RecordCache.destroy(QueryingRecord.name);
        QueryingRecord.firstOrThrow().catch((err) => {
          expect(err.toString()).toEqual("Error: Couldn't find 'QueryingRecord'");
          done();
        });
      });
    });
  });

  describe('[static] last', () => {
    describe('when default', () => {
      it('should return first record', (done) => {
        QueryingRecord.last<QueryingRecord>().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            primaryKey: 1,
          });
          done();
        });
      });
    });

    describe("when specify 'limit'", () => {
      it('should correctly', (done) => {
        QueryingRecord.last(2).then((record) => {
          expect(record).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              primaryKey: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              name: 'name_3',
              primaryKey: 3,
            },
          ]);
          done();
        });
      });
    });

    // TODO: this is bug. order is invalid
    describe("when specify 'limit' over range", () => {
      it('should correctly', (done) => {
        QueryingRecord.last(100).then((record) => {
          expect(record).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              name: 'name_1',
              primaryKey: 1,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              name: 'name_2',
              primaryKey: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 3,
              errors: {},
              name: 'name_3',
              primaryKey: 3,
            },
          ]);
          done();
        });
      });
    });

    describe('when record do not exist', () => {
      it('should return null', (done) => {
        RecordCache.destroy(QueryingRecord.name);
        QueryingRecord.last().then((record) => {
          expect(record).toEqual(null);
          done();
        });
      });
    });
  });

  describe('[static] lastOrThrow', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.lastOrThrow().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            primaryKey: 1,
          });
          done();
        });
      });
    });

    describe('when record not found', () => {
      it('should correctly', (done) => {
        RecordCache.destroy(QueryingRecord.name);
        QueryingRecord.lastOrThrow().catch((err) => {
          expect(err.toString()).toEqual("Error: Couldn't find 'QueryingRecord'");
          done();
        });
      });
    });
  });

  describe('[static] isExists', () => {
    describe("when don't give args", () => {
      it('should correctly', (done) => {
        QueryingRecord.isExists().then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when give args as object', () => {
      it('should correctly', (done) => {
        QueryingRecord.isExists({ age: [1, 2] }).then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when give args as number', () => {
      it('should correctly', (done) => {
        QueryingRecord.isExists(1).then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when give args as string', () => {
      it('should correctly', (done) => {
        QueryingRecord.isExists('2').then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when throw error', () => {
      describe('when give args as array', () => {
        it('should correctly', (done) => {
          QueryingRecord.isExists([1, 2, 3]).catch((err) => {
            expect(err.toString()).toEqual(
              'Do not suppport because where does not correspond to an array argument'
            );
            done();
          });
        });
      });
    });
  });
});