import { ActiveRecord$Relation$Base as Relation } from '../base';
import { ActiveRecord$Base as Record } from '@/records/base';
import { ActiveRecord$Relation$Holder as Holder } from '../holder';

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

    let records: IsExistsRecord[];
    let holder: Holder<IsExistsRecord>;
    let relation: Relation<IsExistsRecord>;

    beforeEach(() => {
      IsExistsRecord.resetRecordCache();

      records = IsExistsRecord.create<IsExistsRecord, IsExistsRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as IsExistsRecord[];

      holder = new Holder(IsExistsRecord, records);

      relation = new Relation<IsExistsRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      ).init(IsExistsRecord);
    });

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
        it('should correctly', (done) => {
          relation.isExists([1, 2, 3]).catch((err) => {
            expect(err.toString()).toEqual(
              'Do not suppport because where does not correspond to an array argument'
            );
            done();
          });
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

    let records: FindRecord[];
    let holder: Holder<FindRecord>;
    let relation: Relation<FindRecord>;

    beforeEach(() => {
      FindRecord.resetRecordCache();

      records = FindRecord.create<FindRecord, FindRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as FindRecord[];

      holder = new Holder(FindRecord, records);

      // @ts-expect-error
      relation = new Relation<FindRecord>((resolve, _reject) => resolve([holder, records])).init(
        FindRecord
      );
    });

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

    let records: FindByRecord[];
    let holder: Holder<FindByRecord>;
    let relation: Relation<FindByRecord>;

    beforeEach(() => {
      FindByRecord.resetRecordCache();

      records = FindByRecord.create<FindByRecord, FindByRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as FindByRecord[];

      holder = new Holder(FindByRecord, records);

      // @ts-expect-error
      relation = new Relation<FindByRecord>((resolve, _reject) => resolve([holder, records])).init(
        FindByRecord
      );
    });

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

    let records: FindByOrThrowRecord[];
    let holder: Holder<FindByOrThrowRecord>;
    let relation: Relation<FindByOrThrowRecord>;

    beforeEach(() => {
      FindByOrThrowRecord.resetRecordCache();

      records = FindByOrThrowRecord.create<FindByOrThrowRecord, FindByOrThrowRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as FindByOrThrowRecord[];

      holder = new Holder(FindByOrThrowRecord, records);

      relation = new Relation<FindByOrThrowRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      ).init(FindByOrThrowRecord);
    });

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

    let records: FirstRecord[];
    let holder: Holder<FirstRecord>;
    let relation: Relation<FirstRecord>;

    beforeEach(() => {
      FirstRecord.resetRecordCache();

      records = FirstRecord.create([
        { name: 'name_1', age: 1 },
        { name: 'name_2', age: 2 },
        { name: 'name_3', age: 3 },
      ]) as FirstRecord[];

      holder = new Holder(FirstRecord, records);

      // @ts-expect-error
      relation = new Relation<FirstRecord>((resolve, _reject) => resolve([holder, records])).init(
        FirstRecord
      );
    });

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
        holder = new Holder(FirstRecord, []);
        // @ts-expect-error
        relation = new Relation<FirstRecord>((resolve, _reject) => resolve([holder, []])).init(
          FirstRecord
        );
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

    let records: FirstOrThrowRecord[];
    let holder: Holder<FirstOrThrowRecord>;
    let relation: Relation<FirstOrThrowRecord>;

    beforeEach(() => {
      FirstOrThrowRecord.resetRecordCache();

      records = FirstOrThrowRecord.create([
        { name: 'name_1', age: 1 },
        { name: 'name_2', age: 2 },
        { name: 'name_3', age: 3 },
      ]) as FirstOrThrowRecord[];

      holder = new Holder(FirstOrThrowRecord, records);

      relation = new Relation<FirstOrThrowRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      ).init(FirstOrThrowRecord);
    });

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
        holder = new Holder(FirstOrThrowRecord, []);
        relation = new Relation<FirstOrThrowRecord>(
          (resolve, _reject) => resolve([holder, []])
          // @ts-expect-error
        ).init(FirstOrThrowRecord);
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

    let records: IsIncludeRecord[];
    let holder: Holder<IsIncludeRecord>;
    let relation: Relation<IsIncludeRecord>;

    beforeEach(() => {
      IsIncludeRecord.resetRecordCache();

      records = IsIncludeRecord.create([
        { name: 'name_1', age: 1 },
        { name: 'name_2', age: 2 },
      ]) as IsIncludeRecord[];

      holder = new Holder(IsIncludeRecord, records);

      relation = new Relation<IsIncludeRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      ).init(IsIncludeRecord);
    });

    describe('when return true', () => {
      it('should correctly', (done) => {
        relation.isInclude(records[0]).then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        const record = IsIncludeRecord.create({ name: 'name_3', age: 3 }) as IsIncludeRecord;
        relation.isInclude(record).then((result) => {
          expect(result).toEqual(false);
          done();
        });
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

    let records: LastRecord[];
    let holder: Holder<LastRecord>;
    let relation: Relation<LastRecord>;

    beforeEach(() => {
      LastRecord.resetRecordCache();

      records = LastRecord.create([
        { name: 'name_1', age: 1 },
        { name: 'name_2', age: 2 },
        { name: 'name_3', age: 3 },
      ]) as LastRecord[];

      holder = new Holder(LastRecord, records);

      // @ts-expect-error
      relation = new Relation<LastRecord>((resolve, _reject) => resolve([holder, records])).init(
        LastRecord
      );
    });

    describe('when default', () => {
      it('should return first record', (done) => {
        relation.last().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 3,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 3,
            errors: {},
            name: 'name_3',
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
        holder = new Holder(LastRecord, []);
        // @ts-expect-error
        relation = new Relation<LastRecord>((resolve, _reject) => resolve([holder, []])).init(
          LastRecord
        );
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

    let records: LastOrThrowRecord[];
    let holder: Holder<LastOrThrowRecord>;
    let relation: Relation<LastOrThrowRecord>;

    beforeEach(() => {
      LastOrThrowRecord.resetRecordCache();

      records = LastOrThrowRecord.create([
        { name: 'name_1', age: 1 },
        { name: 'name_2', age: 2 },
        { name: 'name_3', age: 3 },
      ]) as LastOrThrowRecord[];

      holder = new Holder(LastOrThrowRecord, records);

      relation = new Relation<LastOrThrowRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      ).init(LastOrThrowRecord);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.lastOrThrow().then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 3,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            age: 3,
            errors: {},
            name: 'name_3',
          });
          done();
        });
      });
    });

    describe('when record not found', () => {
      it('should correctly', (done) => {
        holder = new Holder(LastOrThrowRecord, []);
        relation = new Relation<LastOrThrowRecord>(
          (resolve, _reject) => resolve([holder, []])
          // @ts-expect-error
        ).init(LastOrThrowRecord);
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

    let records: TakeRecord[];
    let holder: Holder<TakeRecord>;
    let relation: Relation<TakeRecord>;

    beforeEach(() => {
      TakeRecord.resetRecordCache();

      records = TakeRecord.create([
        { name: 'name_1', age: 1 },
        { name: 'name_2', age: 2 },
        { name: 'name_3', age: 3 },
      ]) as TakeRecord[];

      holder = new Holder(TakeRecord, records);

      // @ts-expect-error
      relation = new Relation<TakeRecord>((resolve, _reject) => resolve([holder, records])).init(
        TakeRecord
      );
    });

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
        holder = new Holder(TakeRecord, []);
        // @ts-expect-error
        relation = new Relation<TakeRecord>((resolve, _reject) => resolve([holder, []])).init(
          TakeRecord
        );
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

    let records: TakeOrThrowRecord[];
    let holder: Holder<TakeOrThrowRecord>;
    let relation: Relation<TakeOrThrowRecord>;

    beforeEach(() => {
      TakeOrThrowRecord.resetRecordCache();

      records = TakeOrThrowRecord.create([
        { name: 'name_1', age: 1 },
        { name: 'name_2', age: 2 },
        { name: 'name_3', age: 3 },
      ]) as TakeOrThrowRecord[];

      holder = new Holder(TakeOrThrowRecord, records);

      relation = new Relation<TakeOrThrowRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      ).init(TakeOrThrowRecord);
    });

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
        holder = new Holder(TakeOrThrowRecord, []);
        relation = new Relation<TakeOrThrowRecord>(
          (resolve, _reject) => resolve([holder, []])
          // @ts-expect-error
        ).init(TakeOrThrowRecord);
        relation.takeOrThrow().catch((err) => {
          expect(err.toString()).toEqual("Error: Couldn't find 'TakeOrThrowRecord'");
          done();
        });
      });
    });
  });
});
