import { ActiveRecord$Base as Record, RECORD_ALL } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import dayjs from 'dayjs';
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

describe('ActiveRecord$Base (Querying)', () => {
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

  describe('[static] isAny', () => {
    describe('when return true', () => {
      it('should correctly', (done) => {
        QueryingRecord.isAny().then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        RecordCache.destroy(QueryingRecord.name);
        QueryingRecord.isAny().then((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', (done) => {
        QueryingRecord.isAny<QueryingRecord>((record) => record.age != 1).then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });
  });

  describe('[static] isMany', () => {
    describe('when return true', () => {
      it('should correctly', (done) => {
        QueryingRecord.isMany().then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        RecordCache.destroy(QueryingRecord.name);
        QueryingRecord.isMany().then((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', (done) => {
        QueryingRecord.isMany<QueryingRecord>((record) => record.age === 1).then((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });
  });

  describe('[static] isNone', () => {
    describe('when return true', () => {
      it('should correctly', (done) => {
        RecordCache.destroy(QueryingRecord.name);
        QueryingRecord.isNone().then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        QueryingRecord.isNone().then((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', (done) => {
        QueryingRecord.isNone<QueryingRecord>((record) => record.age > 4).then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });
  });

  describe('[static] isOne', () => {
    describe('when return true', () => {
      it('should correctly', (done) => {
        RecordCache.destroy(QueryingRecord.name);
        QueryingRecord.create({ primaryKey: 1, name: 'name_1', age: 1 });
        QueryingRecord.isOne().then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        QueryingRecord.isOne().then((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', (done) => {
        QueryingRecord.isOne<QueryingRecord>((record) => record.age === 1).then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });
  });

  describe('[staic] findOrCreateBy', () => {
    class StaticFindOrCreateByRecord extends QueryingRecord {}

    StaticFindOrCreateByRecord.validates('name', { length: { is: 6 } });
    StaticFindOrCreateByRecord.validates('age', { numericality: { lessThan: 10 } });

    // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
    beforeEach(() => {
      StaticFindOrCreateByRecord.create([
        { primaryKey: 1, name: 'name_1', age: 1 },
        { primaryKey: 2, name: 'name_2', age: 2 },
        { primaryKey: 3, name: 'name_3', age: 3 },
      ]);
    });

    afterEach(() => {
      RecordCache.destroy(StaticFindOrCreateByRecord.name);
    });

    describe("when return 'findBy' result", () => {
      it('should correctly', (done) => {
        StaticFindOrCreateByRecord.findOrCreateBy<StaticFindOrCreateByRecord, QueryingRecordParams>(
          {
            name: 'name_1',
          }
        ).then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {
              name: [],
              age: [],
            },
            name: 'name_1',
            primaryKey: 1,
          });
          expect(RecordCache.data[StaticFindOrCreateByRecord.name][RECORD_ALL].length).toEqual(3);
          done();
        });
      });

      describe("when specify 'yielder'", () => {
        it('should correctly', (done) => {
          StaticFindOrCreateByRecord.findOrCreateBy<
            StaticFindOrCreateByRecord,
            QueryingRecordParams
          >({ name: 'name_1' }, (self) => {
            self.name = 'rename';
          }).then((record) => {
            expect(record.name).toEqual('rename');
            done();
          });
        });
      });
    });

    describe("when return 'create' result", () => {
      it('should correctly', (done) => {
        StaticFindOrCreateByRecord.findOrCreateBy<StaticFindOrCreateByRecord, QueryingRecordParams>(
          {
            primaryKey: 4,
            name: 'name_4',
            age: 4,
          }
        ).then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            age: 4,
            errors: {
              name: [],
              age: [],
            },
            name: 'name_4',
            primaryKey: 4,
          });
          expect(RecordCache.data[StaticFindOrCreateByRecord.name][RECORD_ALL].length).toEqual(4);
          done();
        });
      });

      describe("when specify 'yielder'", () => {
        it('should correctly', (done) => {
          StaticFindOrCreateByRecord.findOrCreateBy<
            StaticFindOrCreateByRecord,
            QueryingRecordParams
          >({ primaryKey: 4, name: 'name_4', age: 4 }, (self) => {
            self.age = 100;
          }).then((record) => {
            expect(record).toEqual({
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 4,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 100,
              errors: {
                name: [],
                age: [],
              },
              name: 'name_4',
              primaryKey: 4,
            });
            expect(RecordCache.data[StaticFindOrCreateByRecord.name][RECORD_ALL].length).toEqual(4);
            done();
          });
        });
      });
    });
  });

  describe('[static] findOrCreateByOrThrow', () => {
    class StaticFindOrCreateByOrThrowRecord extends QueryingRecord {}

    StaticFindOrCreateByOrThrowRecord.validates('name', { length: { is: 6 } });
    StaticFindOrCreateByOrThrowRecord.validates('age', { numericality: { lessThan: 10 } });

    // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
    beforeEach(() => {
      StaticFindOrCreateByOrThrowRecord.create([
        { primaryKey: 1, name: 'name_1', age: 1 },
        { primaryKey: 2, name: 'name_2', age: 2 },
        { primaryKey: 3, name: 'name_3', age: 3 },
      ]);
    });

    afterEach(() => {
      RecordCache.destroy(StaticFindOrCreateByOrThrowRecord.name);
    });

    describe("when return 'findBy' result", () => {
      it('should correctly', (done) => {
        StaticFindOrCreateByOrThrowRecord.findOrCreateByOrThrow<
          StaticFindOrCreateByOrThrowRecord,
          QueryingRecordParams
        >({
          name: 'name_1',
        }).then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            age: 1,
            errors: { age: [], name: [] },
            name: 'name_1',
            primaryKey: 1,
          });
          expect(
            RecordCache.data[StaticFindOrCreateByOrThrowRecord.name][RECORD_ALL].length
          ).toEqual(3);
          done();
        });
      });
    });

    describe("when return 'create' result", () => {
      it('shoulld correctly', (done) => {
        StaticFindOrCreateByOrThrowRecord.findOrCreateByOrThrow<
          StaticFindOrCreateByOrThrowRecord,
          QueryingRecordParams
        >({
          primaryKey: 4,
          name: 'name_4',
          age: 4,
        }).then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            age: 4,
            errors: { age: [], name: [] },
            name: 'name_4',
            primaryKey: 4,
          });
          expect(
            RecordCache.data[StaticFindOrCreateByOrThrowRecord.name][RECORD_ALL].length
          ).toEqual(4);
          done();
        });
      });
    });

    describe("when specify 'yielder'", () => {
      it('should correctly', (done) => {
        StaticFindOrCreateByOrThrowRecord.findOrCreateByOrThrow<
          StaticFindOrCreateByOrThrowRecord,
          QueryingRecordParams
        >({ primaryKey: 4, name: 'name_4', age: 4 }, (self) => {
          self.age = undefined;
        }).then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: undefined,
            errors: { age: [], name: [] },
            name: 'name_4',
            primaryKey: 4,
          });
          expect(
            RecordCache.data[StaticFindOrCreateByOrThrowRecord.name][RECORD_ALL].length
          ).toEqual(4);
          done();
        });
      });
    });

    describe('when reject', () => {
      it('should correctly', (done) => {
        StaticFindOrCreateByOrThrowRecord.findOrCreateByOrThrow<
          StaticFindOrCreateByOrThrowRecord,
          QueryingRecordParams
        >({
          name: 'name_6',
        }).catch((err) => {
          expect(err.toString()).toEqual(`Error: StaticFindOrCreateByOrThrowRecord {
  "_destroyed": false,
  "_newRecord": true,
  "errors": {
    "name": [],
    "age": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY IS NOT LESS THAN NUMERIC"
      }
    ]
  },
  "name": "name_6"
} is invalid.`);
          done();
        });
      });
    });
  });

  describe('[static] findOrInitializeBy', () => {
    describe("when return 'findBy' result", () => {
      it('should correctly', (done) => {
        QueryingRecord.findOrInitializeBy<QueryingRecord, QueryingRecordParams>({
          name: 'name_1',
        }).then((record) => {
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
          expect(RecordCache.data[QueryingRecord.name][RECORD_ALL].length).toEqual(3);
          done();
        });
      });
    });

    describe("when return 'new' result", () => {
      it('should correctly', (done) => {
        QueryingRecord.findOrInitializeBy<QueryingRecord, QueryingRecordParams>({
          name: 'name_4',
        }).then((record) => {
          expect(record).toEqual({
            __rue_record_id__: undefined,
            _newRecord: true,
            _destroyed: false,
            errors: {},
            name: 'name_4',
          });
          expect(RecordCache.data[QueryingRecord.name][RECORD_ALL].length).toEqual(3);
          done();
        });
      });
    });
  });

  describe('[static] createOrFindBy', () => {
    describe('when return findBy result', () => {
      it('should correctly', (done) => {
        QueryingRecord.createOrFindBy({ name: 'name_1' }).then((record) => {
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
          expect(RecordCache.data[QueryingRecord.name][RECORD_ALL].length).toEqual(3);
          done();
        });
      });
    });

    describe('when return create result', () => {
      it('should correctly', (done) => {
        QueryingRecord.createOrFindBy({ name: 'name_4' }).then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            age: undefined,
            errors: {},
            name: 'name_4',
          });
          expect(RecordCache.data[QueryingRecord.name][RECORD_ALL].length).toEqual(4);
          done();
        });
      });
    });
  });

  describe('[static] createOrFindByOrThrow', () => {
    class StaticCreateOrFindByOrThrowRecord extends QueryingRecord {}

    StaticCreateOrFindByOrThrowRecord.validates('name', { length: { is: 6 } });
    StaticCreateOrFindByOrThrowRecord.validates('age', {
      numericality: { lessThan: 10 },
      allow_undefined: true,
    });

    // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
    beforeEach(() => {
      StaticCreateOrFindByOrThrowRecord.create([
        { primaryKey: 1, name: 'name_1', age: 1 },
        { primaryKey: 2, name: 'name_2', age: 2 },
        { primaryKey: 3, name: 'name_3', age: 3 },
      ]);
    });

    afterEach(() => {
      RecordCache.destroy(StaticCreateOrFindByOrThrowRecord.name);
    });

    describe("when return 'findBy' result", () => {
      it('should correctly', (done) => {
        StaticCreateOrFindByOrThrowRecord.createOrFindByOrThrow({ name: 'name_1' }).then(
          (record) => {
            expect(record).toEqual({
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: { age: [], name: [] },
              name: 'name_1',
              primaryKey: 1,
            });
            expect(
              RecordCache.data[StaticCreateOrFindByOrThrowRecord.name][RECORD_ALL].length
            ).toEqual(3);
            done();
          }
        );
      });
    });

    describe('when return create result', () => {
      it('should correctly', (done) => {
        StaticCreateOrFindByOrThrowRecord.createOrFindByOrThrow({ name: 'name_4' }).then(
          (record) => {
            expect(record).toEqual({
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 4,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _newRecord: false,
              _destroyed: false,
              errors: {
                name: [],
                age: [],
              },
              name: 'name_4',
            });
            expect(
              RecordCache.data[StaticCreateOrFindByOrThrowRecord.name][RECORD_ALL].length
            ).toEqual(4);
            done();
          }
        );
      });
    });

    describe('when reject', () => {
      it('should correctly', (done) => {
        StaticCreateOrFindByOrThrowRecord.createOrFindByOrThrow({ name: 'name_10' }).catch(
          (err) => {
            expect(err.toString()).toEqual(`Error: StaticCreateOrFindByOrThrowRecord {
  "_destroyed": false,
  "_newRecord": true,
  "errors": {
    "name": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY IS NOT EQUAL LENGTH"
      }
    ],
    "age": []
  },
  "name": "name_10"
} is invalid.`);
            expect(
              RecordCache.data[StaticCreateOrFindByOrThrowRecord.name][RECORD_ALL].length
            ).toEqual(3);
            done();
          }
        );
      });
    });
  });

  describe('[static] destroyAll', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        expect(RecordCache.data[QueryingRecord.name][RECORD_ALL].length).toEqual(3);
        QueryingRecord.destroyAll().then((records) => {
          expect(RecordCache.data[QueryingRecord.name][RECORD_ALL].length).toEqual(0);
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: true,
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
              _destroyed: true,
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
              _destroyed: true,
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
  });

  describe('[static] deleteAll', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        expect(RecordCache.data[QueryingRecord.name][RECORD_ALL].length).toEqual(3);
        QueryingRecord.deleteAll().then((result) => {
          expect(result).toEqual(3);
          expect(RecordCache.data[QueryingRecord.name][RECORD_ALL].length).toEqual(0);
          done();
        });
      });
    });
  });

  describe('[static] updateAll', () => {
    class StaticUpdateAllRecord extends QueryingRecord {}

    StaticUpdateAllRecord.validates('name', { length: { is: 6 } });
    StaticUpdateAllRecord.validates('age', { numericality: { lessThan: 10 } });

    // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
    beforeEach(() => {
      StaticUpdateAllRecord.create([
        { primaryKey: 1, name: 'name_1', age: 1 },
        { primaryKey: 2, name: 'name_2', age: 2 },
      ]);
    });

    afterEach(() => {
      RecordCache.destroy(StaticUpdateAllRecord.name);
    });

    describe("when update 'name' failed", () => {
      it('should correctly', (done) => {
        StaticUpdateAllRecord.updateAll({ name: 'updateName' }).then((result) => {
          expect(result).toEqual(0);
          done();
        });
      });
    });

    describe("when update 'age' success", () => {
      it('should correctly', (done) => {
        StaticUpdateAllRecord.updateAll({ age: 9 }).then((result) => {
          expect(result).toEqual(2);
          done();
        });
      });
    });
  });

  describe('[static] touchAll', () => {
    class StaticTouchAllRecord extends QueryingRecord {}

    StaticTouchAllRecord.validates('name', { length: { is: 6 } });
    StaticTouchAllRecord.validates('age', { numericality: { lessThan: 10 } });

    let records = [];
    beforeEach(() => {
      records = StaticTouchAllRecord.create([
        { primaryKey: 1, name: 'name_1', age: 1 },
        { primaryKey: 2, name: 'name_2', age: 2 },
      ]);
    });

    afterEach(() => {
      RecordCache.destroy(StaticTouchAllRecord.name);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        MockDate.set('2021-03-06T23:03:21+09:00');
        StaticTouchAllRecord.touchAll<StaticTouchAllRecord, QueryingRecordParams>().then(
          (result) => {
            expect(result).toEqual(2);
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-06T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 1,
                errors: { age: [], name: [] },
                name: 'name_1',
                primaryKey: 1,
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-06T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: { age: [], name: [] },
                name: 'name_2',
                primaryKey: 2,
              },
            ]);
            done();
          }
        );
      });
    });

    describe("when specify 'params'", () => {
      it('should correctly', (done) => {
        MockDate.set('2021-03-06T23:03:21+09:00');
        StaticTouchAllRecord.touchAll<StaticTouchAllRecord, QueryingRecordParams>({
          name: 'name_1',
        }).then((result) => {
          expect(result).toEqual(1);
          expect(records[0]).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-06T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            age: 1,
            errors: {
              name: [],
              age: [],
            },
            name: 'name_1',
            primaryKey: 1,
          });
          done();
        });
      });
    });

    describe("when specify 'opts.withCreatedAt'", () => {
      it('should correctly', (done) => {
        MockDate.set('2021-03-06T23:03:21+09:00');
        StaticTouchAllRecord.touchAll<StaticTouchAllRecord, QueryingRecordParams>(
          { name: 'name_1' },
          { withCreatedAt: true }
        ).then((result) => {
          expect(result).toEqual(1);
          expect(records[0]).toEqual({
            __rue_created_at__: '2021-03-06T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-06T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            age: 1,
            errors: {
              name: [],
              age: [],
            },
            name: 'name_1',
            primaryKey: 1,
          });
          done();
        });
      });
    });

    describe("when specify 'opts.time'", () => {
      it('should correctly', (done) => {
        MockDate.reset();
        const time = dayjs().format();
        StaticTouchAllRecord.touchAll<StaticTouchAllRecord, QueryingRecordParams>(
          { name: 'name_2' },
          { time }
        ).then((result) => {
          expect(result).toEqual(1);
          expect(records[1]).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: time,
            _newRecord: false,
            _destroyed: false,
            age: 2,
            errors: {
              name: [],
              age: [],
            },
            name: 'name_2',
            primaryKey: 2,
          });
          done();
        });
      });
    });
  });

  describe('[static] destroyBy', () => {
    describe('when default', () => {
      it('should correctly', (done) => {
        QueryingRecord.destroyBy().then((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: true,
              age: 1,
              _newRecord: false,
              errors: {},
              name: 'name_1',
              primaryKey: 1,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 2,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: true,
              age: 2,
              errors: {},
              _newRecord: false,
              name: 'name_2',
              primaryKey: 2,
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 3,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: true,
              _newRecord: false,
              age: 3,
              errors: {},
              name: 'name_3',
              primaryKey: 3,
            },
          ]);
          expect(RecordCache.data[QueryingRecord.name][RECORD_ALL].length).toEqual(0);
          done();
        });
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', (done) => {
        QueryingRecord.destroyBy<QueryingRecord>((self) => self.name === 'name_1').then(
          (record) => {
            expect(record).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: true,
                _newRecord: false,
                age: 1,
                errors: {},
                name: 'name_1',
                primaryKey: 1,
              },
            ]);
            expect(RecordCache.data[QueryingRecord.name][RECORD_ALL].length).toEqual(2);
            done();
          }
        );
      });
    });
  });

  describe('[static] deleteBy', () => {
    class StaticDeleteByRecord extends QueryingRecord {}

    let records;
    beforeEach(() => {
      records = StaticDeleteByRecord.create([
        { primaryKey: 1, name: 'name_1', age: 1 },
        { primaryKey: 2, name: 'name_2', age: 2 },
        { primaryKey: 3, name: 'name_3', age: 3 },
      ]);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        StaticDeleteByRecord.deleteBy().then((result) => {
          expect(result).toEqual(3);
          expect(RecordCache.data[StaticDeleteByRecord.name][RECORD_ALL].length).toEqual(0);
          done();
        });
      });
    });

    describe("when specify 'params'", () => {
      it('should correctly', (done) => {
        StaticDeleteByRecord.deleteBy({ age: [1, 2] }).then((result) => {
          expect(result).toEqual(2);
          expect(RecordCache.data[StaticDeleteByRecord.name][RECORD_ALL].length).toEqual(1);
          done();
        });
      });
    });
  });
});
