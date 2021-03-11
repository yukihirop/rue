import { ActiveRecord$Relation$Base as Relation } from '../base';
import { ActiveRecord$Base as Record } from '@/records/base';

// third party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class IsExistsRecord extends Record<IsExistsRecordParams> {
      public id: IsExistsRecordParams['id'];
      public name: IsExistsRecordParams['name'];
      public age: IsExistsRecordParams['age'];

      protected fetchAll(): Promise<IsExistsRecordParams[]> {
        return Promise.resolve([]);
      }
    }

    const records = IsExistsRecord.create<IsExistsRecord, IsExistsRecordParams>([
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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class FindRecord extends Record<FindRecordParams> {
      public id: FindRecordParams['id'];
      public name: FindRecordParams['name'];
      public age: FindRecordParams['age'];

      protected fetchAll(): Promise<FindRecordParams[]> {
        return Promise.resolve([]);
      }
    }

    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = FindRecord.create<FindRecord, FindRecordParams>([
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
            expect(err.toString()).toEqual("Error: Could'nt find 'FindRecord' without an 'id'");
            done();
          });
        });
      });

      describe("when specify don't exists 'id'", () => {
        it('should correctly', (done) => {
          relation.find(100).catch((err) => {
            expect(err.toString()).toEqual("Error: Couldn't find 'FindRecord' with 'id' = '100'");
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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class FindByRecord extends Record<FindByRecordParams> {
      public id: FindByRecordParams['id'];
      public name: FindByRecordParams['name'];
      public age: FindByRecordParams['age'];
    }

    const records = FindByRecord.create<FindByRecord, FindByRecordParams>([
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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class FindByOrThrowRecord extends Record<FindByOrThrowRecordParams> {
      public id: FindByOrThrowRecordParams['id'];
      public name: FindByOrThrowRecordParams['name'];
      public age: FindByOrThrowRecordParams['age'];

      protected fetchAll(): Promise<FindByOrThrowRecordParams[]> {
        return Promise.resolve([]);
      }
    }

    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = FindByOrThrowRecord.create<FindByOrThrowRecord, FindByOrThrowRecordParams>([
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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class FirstRecord extends Record<FirstRecordParams> {
      public id: FirstRecordParams['id'];
      public name: FirstRecordParams['name'];
      public age: FirstRecordParams['age'];

      protected fetchAll(): Promise<FirstRecordParams[]> {
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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class FirstOrThrowRecord extends Record<FirstOrThrowParams> {
      public id: FirstOrThrowParams['id'];
      public name: FirstOrThrowParams['name'];
      public age: FirstOrThrowParams['age'];

      protected fetchAll(): Promise<FirstOrThrowParams[]> {
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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class IsIncludeRecord extends Record<IsIncludeRecordParams> {
      public id: IsIncludeRecordParams['id'];
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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class LastRecord extends Record {
      public id: LastRecordParams['id'];
      public name: LastRecordParams['name'];
      public age: LastRecordParams['age'];

      protected fetchAll(): Promise<LastRecordParams[]> {
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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class LastOrThrowRecord extends Record<LastOrThrowParams> {
      public id: LastOrThrowParams['id'];
      public name: LastOrThrowParams['name'];
      public age: LastOrThrowParams['age'];

      protected fetchAll(): Promise<LastOrThrowParams[]> {
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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class TakeRecord extends Record<TakeRecordParams> {
      public id: TakeRecordParams['id'];
      public name: TakeRecordParams['name'];
      public age: TakeRecordParams['age'];

      protected fetchAll(): Promise<TakeRecordParams[]> {
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
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class TakeOrThrowRecord extends Record<TakeOrThrowParams> {
      public id: TakeOrThrowParams['id'];
      public name: TakeOrThrowParams['name'];
      public age: TakeOrThrowParams['age'];

      protected fetchAll(): Promise<TakeOrThrowParams[]> {
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
