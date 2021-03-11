import { ActiveRecord$Relation$Base as Relation } from '../base';
import { ActiveRecord$Base as Record } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import MockDate from 'mockdate';

// types
import type * as at from '@/records/modules/associations';

describe('ActiveRecord$Relation (FinderMethods)', () => {
  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeEach(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('#isExists', () => {
    type IsExistsRecordParams = {
      id: at.Associations$PrimaryKey;
      name: string;
      age: number;
    };

    class IsExistsRecord extends Record {
      public id: IsExistsRecordParams['id'];
      public name: IsExistsRecordParams['name'];
      public age: IsExistsRecordParams['age'];

      protected static fetchAll<T = IsExistsRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    const records = IsExistsRecord.create([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as IsExistsRecord[];

    let relation = new Relation<IsExistsRecord>(IsExistsRecord, records);

    describe("when don't give args", () => {
      it('should correctly', (done) => {
        relation.isExists().then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when give args as object', () => {
      it('should correctly', (done) => {
        relation.isExists({ age: [1, 2] }).then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when give args as number', () => {
      it('should correctly', (done) => {
        relation.isExists(1).then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when give args as string', () => {
      it('should correctly', (done) => {
        relation.isExists('2').then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when throw error', () => {
      describe('when give args as array', () => {
        it('should correctly', () => {
          expect(() => {
            relation.isExists([1, 2, 3]);
          }).toThrowError('Do not suppport because where does not correspond to an array argument');
        });
      });
    });
  });

  describe('#find', () => {
    type FindRecordParams = {
      id: at.Associations$PrimaryKey;
      name: string;
      age: number;
    };

    class FindRecord extends Record {
      public id: at.Associations$PrimaryKey;
      public name: FindRecordParams['name'];
      public age: FindRecordParams['age'];

      protected static fetchAll<T = FindRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = FindRecord.create([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as FindRecord[];

    let relation = new Relation<FindRecord>(FindRecord, records);

    describe("when specify 'primarykey'", () => {
      it('should correctly', (done) => {
        relation.find(1).then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            id: 1,
          });
          done();
        });
      });
    });

    describe("when specify array of 'id'", () => {
      it('should correctly', (done) => {
        relation.find(1, 2).then((records: FindRecord[]) => {
          expect(records.length).toEqual(2);
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 1,
              errors: {},
              name: 'name_1',
              id: 1,
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
              id: 2,
            },
          ]);
          done();
        });
      });
    });

    describe('when throw error', () => {
      describe("when do not specify 'id'", () => {
        it('should correctly', (done) => {
          relation.find().catch((err) => {
            expect(err.toString()).toEqual(
              "Error: Could'nt find 'FindRecord' without an 'id'"
            );
            done();
          });
        });
      });

      describe("when specify don't exists 'id'", () => {
        it('should correctly', (done) => {
          relation.find(100).catch((err) => {
            expect(err.toString()).toEqual(
              "Error: Couldn't find 'FindRecord' with 'id' = '100'"
            );
            done();
          });
        });
      });

      describe("when specify don't exists array of 'id'", () => {
        it('should correctly', (done) => {
          relation.find(100, 200).catch((err) => {
            expect(err.toString()).toEqual(
              "Error: Could't find all 'FindRecord' with 'id': [100,200] (found 0 results, but was looking for 2)"
            );
            done();
          });
        });
      });
    });
  });

  describe('#findBy', () => {
    type FindByRecordParams = {
      id: at.Associations$PrimaryKey;
      name: string;
      age: number;
    };

    class FindByRecord extends Record {
      public id: FindByRecordParams['id'];
      public name: FindByRecordParams['name'];
      public age: FindByRecordParams['age'];
    }

    const records = FindByRecord.create([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as FindByRecord[];

    let relation = new Relation<FindByRecord>(FindByRecord, records);

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.findBy({ id: [1, 2] }).then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            id: 1,
          });
          done();
        });
      });
    });

    describe('when record not found', () => {
      it('should correctly', (done) => {
        relation.findBy({ name: 'doNotExists' }).then((record) => {
          expect(record).toEqual(null);
          done();
        });
      });
    });
  });

  describe('#findByOrThrow', () => {
    type FindByOrThrowRecordParams = {
      id: at.Associations$PrimaryKey;
      name: string;
      age: number;
    };

    class FindByOrThrowRecord extends Record {
      public id: FindByOrThrowRecordParams['id'];
      public name: FindByOrThrowRecordParams['name'];
      public age: FindByOrThrowRecordParams['age'];

      protected static fetchAll<T = FindByOrThrowRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = FindByOrThrowRecord.create([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as FindByOrThrowRecord[];

    let relation = new Relation<FindByOrThrowRecord>(FindByOrThrowRecord, records);

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.findByOrThrow({ id: [1, 2] }).then((records) => {
          expect(records).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
            id: 1,
          });
          done();
        });
      });
    });

    describe('when throw error', () => {
      it('should correctly', (done) => {
        relation.findByOrThrow({ name: 'doNotExists' }).catch((err) => {
          expect(err.toString()).toEqual("Error: Couldn't find 'FindByOrThrowRecord'");
          done();
        });
      });
    });
  });

  describe('#first', () => {
    type FirstRecordParams = {
      name: string;
      age: number;
    };

    class FirstRecord extends Record {
      public name: FirstRecordParams['name'];
      public age: FirstRecordParams['age'];

      protected static fetchAll<T = FirstRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = FirstRecord.create([
      { name: 'name_1', age: 1 },
      { name: 'name_2', age: 2 },
      { name: 'name_3', age: 3 },
    ]) as FirstRecord[];

    let relation = new Relation<FirstRecord>(FirstRecord, records);

    describe('when default', () => {
      it('should return first record', (done) => {
        relation.first().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
          });
          done();
        });
      });
    });

    describe("when specify 'limit'", () => {
      it('should correctly', (done) => {
        relation.first(2).then((record) => {
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
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'limit' over range", () => {
      it('should correctly', (done) => {
        relation.first(100).then((record) => {
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
            },
          ]);
          done();
        });
      });
    });

    describe('when record do not exist', () => {
      it('should return null', (done) => {
        relation = new Relation<FirstRecord>(FirstRecord, []);
        relation.take().then((record) => {
          expect(record).toEqual(null);
          done();
        });
      });
    });
  });

  describe('#firstOrThrow', () => {
    type FirstOrThrowParams = {
      name: string;
      age: number;
    };

    class FirstOrThrowRecord extends Record {
      public name: FirstOrThrowParams['name'];
      public age: FirstOrThrowParams['age'];

      protected static fetchAll<T = FirstOrThrowParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    const records = FirstOrThrowRecord.create([
      { name: 'name_1', age: 1 },
      { name: 'name_2', age: 2 },
      { name: 'name_3', age: 3 },
    ]) as FirstOrThrowRecord[];

    let relation = new Relation<FirstOrThrowRecord>(FirstOrThrowRecord, records);

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.firstOrThrow().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
          });
          done();
        });
      });
    });

    describe('when record not found', () => {
      it('should correctly', (done) => {
        relation = new Relation<FirstOrThrowRecord>(FirstOrThrowRecord, []);
        relation.firstOrThrow().catch((err) => {
          expect(err.toString()).toEqual("Error: Couldn't find 'FirstOrThrowRecord'");
          done();
        });
      });
    });
  });

  describe('#isInclude', () => {
    type IsIncludeRecordParams = {
      name: string;
      age: number;
    };

    class IsIncludeRecord extends Record {
      public name: IsIncludeRecordParams['name'];
      public age: IsIncludeRecordParams['age'];
    }

    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = IsIncludeRecord.create([
      { name: 'name_1', age: 1 },
      { name: 'name_2', age: 2 },
    ]) as IsIncludeRecord[];

    let relation = new Relation<IsIncludeRecord>(IsIncludeRecord, records);

    describe('when return true', () => {
      it('should correctly', () => {
        expect(relation.isInclude(records[0])).toEqual(true);
      });
    });

    describe('when return false', () => {
      it('should correctly', () => {
        const record = IsIncludeRecord.create({ name: 'name_3', age: 3 }) as IsIncludeRecord;
        expect(relation.isInclude(record)).toEqual(false);
      });
    });
  });

  describe('#last', () => {
    type LastRecordParams = {
      name: string;
      age: number;
    };

    class LastRecord extends Record {
      public name: LastRecordParams['name'];
      public age: LastRecordParams['age'];

      protected static fetchAll<T = LastRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = LastRecord.create([
      { name: 'name_1', age: 1 },
      { name: 'name_2', age: 2 },
      { name: 'name_3', age: 3 },
    ]) as LastRecord[];

    let relation = new Relation<LastRecord>(LastRecord, records);

    describe('when default', () => {
      it('should return first record', (done) => {
        relation.last().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
          });
          done();
        });
      });
    });

    describe("when specify 'limit'", () => {
      it('should correctly', (done) => {
        relation.last(2).then((record) => {
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
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'limit' over range", () => {
      it('should correctly', (done) => {
        relation.last(100).then((record) => {
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
            },
          ]);
          done();
        });
      });
    });

    describe('when record do not exist', () => {
      it('should return null', (done) => {
        relation = new Relation<LastRecord>(LastRecord, []);
        relation.last().then((record) => {
          expect(record).toEqual(null);
          done();
        });
      });
    });
  });

  describe('#lastOrThrow', () => {
    type LastOrThrowParams = {
      name: string;
      age: number;
    };

    class LastOrThrowRecord extends Record {
      public name: LastOrThrowParams['name'];
      public age: LastOrThrowParams['age'];

      protected static fetchAll<T = LastOrThrowParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    const records = LastOrThrowRecord.create([
      { name: 'name_1', age: 1 },
      { name: 'name_2', age: 2 },
      { name: 'name_3', age: 3 },
    ]) as LastOrThrowRecord[];

    let relation = new Relation<LastOrThrowRecord>(LastOrThrowRecord, records);

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.lastOrThrow().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
          });
          done();
        });
      });
    });

    describe('when record not found', () => {
      it('should correctly', (done) => {
        relation = new Relation<LastOrThrowRecord>(LastOrThrowRecord, []);
        relation.lastOrThrow().catch((err) => {
          expect(err.toString()).toEqual("Error: Couldn't find 'LastOrThrowRecord'");
          done();
        });
      });
    });
  });

  describe('#take', () => {
    type TakeRecordParams = {
      name: string;
      age: number;
    };

    class TakeRecord extends Record {
      public name: TakeRecordParams['name'];
      public age: TakeRecordParams['age'];

      protected static fetchAll<T = TakeRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = TakeRecord.create([
      { name: 'name_1', age: 1 },
      { name: 'name_2', age: 2 },
      { name: 'name_3', age: 3 },
    ]) as TakeRecord[];

    let relation = new Relation<TakeRecord>(TakeRecord, records);

    describe('when default', () => {
      it('should return first record', (done) => {
        relation.take().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
          });
          done();
        });
      });
    });

    describe("when specify 'limit'", () => {
      it('should correctly', (done) => {
        relation.take(2).then((record) => {
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
            },
          ]);
          done();
        });
      });
    });

    describe("when specify 'limit' over range", () => {
      it('should correctly', (done) => {
        relation.take(100).then((record) => {
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
            },
          ]);
          done();
        });
      });
    });

    describe('when record do not exist', () => {
      it('should return null', (done) => {
        relation = new Relation<TakeRecord>(TakeRecord, []);
        relation.take().then((record) => {
          expect(record).toEqual(null);
          done();
        });
      });
    });
  });

  describe('#takeOrThrow', () => {
    type TakeOrThrowParams = {
      name: string;
      age: number;
    };

    class TakeOrThrowRecord extends Record {
      public name: TakeOrThrowParams['name'];
      public age: TakeOrThrowParams['age'];

      protected static fetchAll<T = TakeOrThrowParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    const records = TakeOrThrowRecord.create([
      { name: 'name_1', age: 1 },
      { name: 'name_2', age: 2 },
      { name: 'name_3', age: 3 },
    ]) as TakeOrThrowRecord[];

    let relation = new Relation<TakeOrThrowRecord>(TakeOrThrowRecord, records);

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.takeOrThrow().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 1,
            errors: {},
            name: 'name_1',
          });
          done();
        });
      });
    });

    describe('when record not found', () => {
      it('should correctly', (done) => {
        relation = new Relation<TakeOrThrowRecord>(TakeOrThrowRecord, []);
        relation.takeOrThrow().catch((err) => {
          expect(err.toString()).toEqual("Error: Couldn't find 'TakeOrThrowRecord'");
          done();
        });
      });
    });
  });
});
