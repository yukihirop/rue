import { ActiveRecord$Relation$Base as Relation } from '../base';
import { ActiveRecord$Base, RECORD_ALL } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import MockDate from 'mockdate';
import dayjs from 'dayjs';

// types
import type * as t from '@/index';

describe('ActiveRecord$Relation$Base', () => {
  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeAll(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterAll(() => {
    MockDate.reset();
  });

  describe('costructor', () => {
    class ConstructorRecord extends ActiveRecord$Base {}

    const records = [new ConstructorRecord(), new ConstructorRecord(), new ConstructorRecord()];
    it('should correctly', () => {
      const relation = new Relation<ConstructorRecord>(ConstructorRecord, records);
      // @ts-ignore
      expect(typeof relation.recordKlass === 'function').toEqual(true);
      // @ts-ignore
      expect(relation.recordKlass.name).toEqual('ConstructorRecord');
      // @ts-ignore
      expect(relation.records).toEqual(records);
    });
  });

  describe('#isMany', () => {
    type IsManyRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class IsManyRecord extends ActiveRecord$Base<IsManyRecordParams> {
      public id: IsManyRecordParams['id'];
      public name: IsManyRecordParams['name'];
      public age: IsManyRecordParams['age'];
    }

    const records = IsManyRecord.create<IsManyRecord, IsManyRecordParams>([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as IsManyRecord[];

    const relation = new Relation<IsManyRecord>(IsManyRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when return true', () => {
      it('should correctly', () => {
        expect(relation.isMany()).toEqual(true);
      });
    });

    describe('when return false', () => {
      it('should correctly', () => {
        // @ts-ignore
        relation.records = [records[0]];
        expect(relation.isMany()).toEqual(false);
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', () => {
        expect(relation.isMany((record) => record.age === 1)).toEqual(false);
      });
    });
  });

  describe('#isNone', () => {
    type IsNoneRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class IsNoneRecord extends ActiveRecord$Base<IsNoneRecordParams> {
      public id: IsNoneRecordParams['id'];
      public name: IsNoneRecordParams['name'];
      public age: IsNoneRecordParams['age'];
    }

    const records = [
      IsNoneRecord.create<IsNoneRecord, IsNoneRecordParams>({
        id: 1,
        name: 'name_1',
        age: 1,
      }) as IsNoneRecord,
    ];

    const relation = new Relation<IsNoneRecord>(IsNoneRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when return true', () => {
      it('should correctly', () => {
        // @ts-ignore
        relation.records = [];
        expect(relation.isNone()).toEqual(true);
      });
    });

    describe('when return false', () => {
      it('should correctly', () => {
        expect(relation.isNone()).toEqual(false);
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', () => {
        expect(relation.isNone((record) => record.age > 4)).toEqual(true);
      });
    });
  });

  describe('#isOne', () => {
    type IsOneRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class IsOneRecord extends ActiveRecord$Base<IsOneRecordParams> {
      public id: IsOneRecordParams['id'];
      public name: IsOneRecordParams['name'];
      public age: IsOneRecordParams['age'];
    }

    const records = IsOneRecord.create<IsOneRecord, IsOneRecordParams>([
      { id: 1, name: 'name_1', age: 1 },
      { id: 1, name: 'name_2', age: 2 },
    ]) as IsOneRecord[];

    const relation = new Relation<IsOneRecord>(IsOneRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when return true', () => {
      it('should correctly', () => {
        // @ts-ignore
        relation.records = [records[0]];
        expect(relation.isOne()).toEqual(true);
      });
    });

    describe('when return false', () => {
      it('should correctly', () => {
        expect(relation.isOne()).toEqual(false);
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', () => {
        expect(relation.isOne((record) => record.age === 1)).toEqual(true);
      });
    });
  });

  describe('#isAny', () => {
    type IsAnyRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class IsAnyRecord extends ActiveRecord$Base<IsAnyRecordParams> {
      public id: IsAnyRecordParams['id'];
      public name: IsAnyRecordParams['name'];
      public age: IsAnyRecordParams['age'];
    }

    const records = [IsAnyRecord.create({ name: 'name_1', age: 1 }) as IsAnyRecord];

    const relation = new Relation<IsAnyRecord>(IsAnyRecord, records);

    describe('when return true', () => {
      it('should correctly', () => {
        expect(relation.isAny()).toEqual(true);
      });
    });

    describe('when return false', () => {
      it('should correctly', () => {
        // @ts-ignore
        relation.records = [];
        expect(relation.isAny()).toEqual(false);
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', () => {
        expect(relation.isAny((record) => record.age != 1)).toEqual(false);
      });
    });
  });

  describe('#isBlank', () => {
    type IsBlankRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class IsBlankRecord extends ActiveRecord$Base<IsBlankRecordParams> {
      public id: IsBlankRecordParams['id'];
      public name: IsBlankRecordParams['name'];
      public age: IsBlankRecordParams['age'];
    }

    const records = [
      IsBlankRecord.create<IsBlankRecord, IsBlankRecordParams>({
        id: 1,
        name: 'name_1',
        age: 1,
      }) as IsBlankRecord,
    ];

    const relation = new Relation<IsBlankRecord>(IsBlankRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when return true', () => {
      it('should correctly', () => {
        // @ts-ignore
        relation.records = [];
        expect(relation.isBlank()).toEqual(true);
      });
    });

    describe('when return false', () => {
      it('should correctly', () => {
        expect(relation.isBlank()).toEqual(false);
      });
    });
  });

  describe('#build', () => {
    type BuildRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class BuildRecord extends ActiveRecord$Base<BuildRecordParams> {
      public id: BuildRecordParams['id'];
      public name: BuildRecordParams['name'];
      public age: BuildRecordParams['age'];
    }

    const records = BuildRecord.create<BuildRecord, BuildRecordParams>([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as BuildRecord[];

    const relation = new Relation<BuildRecord>(BuildRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when default', () => {
      it('should correctly', () => {
        expect(relation.build()).toEqual({
          __rue_record_id__: undefined,
          _destroyed: false,
          _newRecord: true,
          errors: {},
        });
        // @ts-ignore
        expect(relation.records.length).toEqual(3);
      });
    });

    describe("when specify 'params'", () => {
      it('should correctly', () => {
        expect(relation.build({ name: 'name_4', age: 4 })).toEqual({
          __rue_record_id__: undefined,
          _destroyed: false,
          _newRecord: true,
          age: 4,
          errors: {},
          name: 'name_4',
        });
        // @ts-ignore
        expect(relation.records.length).toEqual(3);
      });
    });

    describe("when specify 'yielder'", () => {
      it('shoulld correctly', () => {
        expect(
          relation.build({ name: 'name_5' }, (self) => {
            self.age = 5;
          })
        ).toEqual({
          __rue_record_id__: undefined,
          _destroyed: false,
          _newRecord: true,
          age: 5,
          errors: {},
          name: 'name_5',
        });
        // @ts-ignore
        expect(relation.records.length).toEqual(3);
      });
    });
  });

  describe('#create', () => {
    type CreateRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class CreateRecord extends ActiveRecord$Base<CreateRecordParams> {
      public id: CreateRecordParams['id'];
      public name: CreateRecordParams['name'];
      public age: CreateRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }
    }

    CreateRecord.validates('name', { length: { is: 6 }, allow_undefined: true });
    CreateRecord.validates('age', { numericality: { lessThan: 10 }, allow_undefined: true });

    const records = [
      new CreateRecord({ id: 1, name: 'name_1', age: 1 }),
      new CreateRecord({ id: 2, name: 'name_2', age: 2 }),
      new CreateRecord({ id: 3, name: 'name_3', age: 3 }),
    ];

    const relation = new Relation<CreateRecord>(CreateRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
      CreateRecord.resetRecordCache();
    });

    describe('when default', () => {
      it('should correctly', () => {
        const record = relation.create<CreateRecordParams>();
        const cacheAll = RecordCache.data['CreateRecord'][RECORD_ALL];
        expect(record.name).toEqual(undefined);
        expect(record.age).toEqual(undefined);
        expect(cacheAll.length).toEqual(1);
        expect(cacheAll[0].name).toEqual(undefined);
        expect(cacheAll[0].age).toEqual(undefined);
        // @ts-ignore
        expect(relation.records.length).toEqual(4);
      });
    });

    describe("when specify 'params'", () => {
      describe('when valid', () => {
        it('should correctly', () => {
          const record = relation.create<CreateRecordParams>({ name: 'name_4', age: 4 });
          const cacheAll = RecordCache.data['CreateRecord'][RECORD_ALL];
          expect(record.name).toEqual('name_4');
          expect(record.age).toEqual(4);
          expect(cacheAll.length).toEqual(1);
          expect(cacheAll[0]).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            age: 4,
            errors: { name: [], age: [] },
            name: 'name_4',
          });
          // @ts-ignore
          expect(relation.records.length).toEqual(4);
        });
      });

      describe('when invalid', () => {
        it('should correctly', () => {
          const record = relation.create<CreateRecordParams>({ name: 'name_10', age: 10 });
          const cacheAll = RecordCache.data['CreateRecord'][RECORD_ALL];
          expect(record.name).toEqual('name_10');
          expect(record.age).toEqual(10);
          expect(cacheAll.length).toEqual(0);
          // @ts-ignore
          expect(relation.records.length).toEqual(4);
        });
      });
    });
  });

  describe('#createOrThrow', () => {
    type CreateOrThrowRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class CreateOrThrowRecord extends ActiveRecord$Base<CreateOrThrowRecordParams> {
      public id: CreateOrThrowRecordParams['id'];
      public name: CreateOrThrowRecordParams['name'];
      public age: CreateOrThrowRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }
    }

    CreateOrThrowRecord.validates('name', { length: { is: 6 }, allow_undefined: true });
    CreateOrThrowRecord.validates('age', {
      numericality: { lessThan: 10 },
      allow_undefined: true,
    });

    const records = [
      new CreateOrThrowRecord({ id: 1, name: 'name_1', age: 1 }),
      new CreateOrThrowRecord({ id: 2, name: 'name_2', age: 2 }),
      new CreateOrThrowRecord({ id: 3, name: 'name_3', age: 3 }),
    ];

    const relation = new Relation<CreateOrThrowRecord>(CreateOrThrowRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
      CreateOrThrowRecord.resetRecordCache();
    });

    describe('when default', () => {
      it('should correctly', () => {
        const record = relation.create<CreateOrThrowRecordParams>();
        const cacheAll = RecordCache.data['CreateOrThrowRecord'][RECORD_ALL];
        expect(record.name).toEqual(undefined);
        expect(record.age).toEqual(undefined);
        expect(cacheAll.length).toEqual(1);
        expect(cacheAll[0].name).toEqual(undefined);
        expect(cacheAll[0].age).toEqual(undefined);
        // @ts-ignore
        expect(relation.records.length).toEqual(4);
      });
    });

    describe("when specify 'params'", () => {
      describe('when valid', () => {
        it('should correctly', () => {
          const record = relation.createOrThrow<CreateOrThrowRecordParams>({
            name: 'name_4',
            age: 4,
          });
          const cacheAll = RecordCache.data['CreateOrThrowRecord'][RECORD_ALL];
          expect(record.name).toEqual('name_4');
          expect(record.age).toEqual(4);
          expect(cacheAll.length).toEqual(1);
          expect(cacheAll[0].name).toEqual('name_4');
          expect(cacheAll[0].age).toEqual(4);
          // @ts-ignore
          expect(relation.records.length).toEqual(4);
        });
      });

      describe('when invalid', () => {
        it('should correctly', () => {
          const cacheAll = RecordCache.data['CreateOrThrowRecord'][RECORD_ALL];
          expect(() => {
            relation.createOrThrow<CreateOrThrowRecordParams>({ name: 'name_10', age: 10 });
          }).toThrowError(`CreateOrThrowRecord {
  "_destroyed": false,
  "_newRecord": true,
  "age": 10,
  "errors": {
    "name": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY IS NOT EQUAL LENGTH"
      }
    ],
    "age": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY IS NOT LESS THAN NUMERIC"
      }
    ]
  },
  "name": "name_10"
} is invalid.`);
          expect(cacheAll.length).toEqual(0);
          // @ts-ignore
          expect(relation.records.length).toEqual(3);
        });
      });
    });
  });

  describe('#createOrFindBy', () => {
    type CreateOrFindByRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class CreateOrFindByRecord extends ActiveRecord$Base<CreateOrFindByRecordParams> {
      public id: CreateOrFindByRecordParams['id'];
      public name: CreateOrFindByRecordParams['name'];
      public age: CreateOrFindByRecordParams['age'];
    }

    const records = CreateOrFindByRecord.create<CreateOrFindByRecord, CreateOrFindByRecordParams>([
      { id: 1, name: 'name_1', age: 1 },
      { id: 1, name: 'name_2', age: 2 },
      { id: 1, name: 'name_3', age: 3 },
    ]) as CreateOrFindByRecord[];

    const relation = new Relation<CreateOrFindByRecord>(CreateOrFindByRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when return findBy result', () => {
      it('should correctly', (done) => {
        relation.createOrFindBy({ name: 'name_1' }).then((record) => {
          expect(record).toEqual(records[0]);
          // @ts-ignore
          expect(relation.records.length).toEqual(3);
          done();
        });
      });
    });

    describe('when return create result', () => {
      it('should correctly', (done) => {
        relation.createOrFindBy({ name: 'name_4' }).then((record) => {
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
          // @ts-ignore
          expect(relation.records.length).toEqual(4);
          done();
        });
      });
    });
  });

  describe('#createOrFindByOrThrow', () => {
    type CreateOrFindByOrThrowRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class CreateOrFindByOrThrowRecord extends ActiveRecord$Base<CreateOrFindByOrThrowRecordParams> {
      public id: CreateOrFindByOrThrowRecordParams['id'];
      public name: CreateOrFindByOrThrowRecordParams['name'];
      public age: CreateOrFindByOrThrowRecordParams['age'];

      static translate(key: string, opts: string): string {
        return key;
      }
    }

    CreateOrFindByOrThrowRecord.validates('name', { length: { is: 6 } });

    const records = CreateOrFindByOrThrowRecord.create<
      CreateOrFindByOrThrowRecord,
      CreateOrFindByOrThrowRecordParams
    >([
      { id: 1, name: 'name_1', age: 1 },
      { id: 1, name: 'name_2', age: 2 },
      { id: 1, name: 'name_3', age: 3 },
    ]) as CreateOrFindByOrThrowRecord[];

    const relation = new Relation<CreateOrFindByOrThrowRecord>(
      CreateOrFindByOrThrowRecord,
      records
    );

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when return findBy result', () => {
      it('should correctly', (done) => {
        relation.createOrFindByOrThrow({ name: 'name_1' }).then((record) => {
          expect(record).toEqual(records[0]);
          // @ts-ignore
          expect(relation.records.length).toEqual(3);
          done();
        });
      });
    });

    describe('when return create result', () => {
      it('should correctly', (done) => {
        relation.createOrFindByOrThrow({ name: 'name_4' }).then((record) => {
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            errors: { name: [] },
            name: 'name_4',
          });
          // @ts-ignore
          expect(relation.records.length).toEqual(4);
          done();
        });
      });
    });

    describe('when reject', () => {
      it('should correctly', (done) => {
        relation.createOrFindByOrThrow({ name: 'name_10' }).catch((err) => {
          expect(err.toString()).toEqual(`Error: CreateOrFindByOrThrowRecord {
  "_destroyed": false,
  "_newRecord": true,
  "errors": {
    "name": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY IS NOT EQUAL LENGTH"
      }
    ]
  },
  "name": "name_10"
} is invalid.`);
          // @ts-ignore
          expect(relation.records.length).toEqual(3);
          done();
        });
      });
    });
  });

  describe('#deleteBy', () => {
    type DeleteByRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class DeleteByRecord extends ActiveRecord$Base<DeleteByRecordParams> {
      public id: DeleteByRecordParams['id'];
      public name: DeleteByRecordParams['name'];
      public age: DeleteByRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }

      protected static fetchAll<T = DeleteByRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    const relation = new Relation<DeleteByRecord>(DeleteByRecord, []);

    // @important
    // records are object.freeze when destroyed

    beforeEach(() => {
      const records = DeleteByRecord.create<DeleteByRecord, DeleteByRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]);
      // @ts-ignore
      relation.records = records;
      RecordCache.update(DeleteByRecord.name, RECORD_ALL, records);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.deleteBy().then((result) => {
          expect(result).toEqual(3);
          // @ts-ignore
          expect(relation.records.length).toEqual(0);
          done();
        });
      });
    });

    describe("when specify 'params'", () => {
      it('should correctly', (done) => {
        relation.deleteBy({ age: [1, 2] }).then((result) => {
          expect(result).toEqual(2);
          // @ts-ignore
          expect(relation.records.length).toEqual(1);
          done();
        });
      });
    });
  });

  describe('#destroyBy', () => {
    type DestoryByRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class DestroyByRecord extends ActiveRecord$Base<DestoryByRecordParams> {
      public id: DestoryByRecordParams['id'];
      public name: DestoryByRecordParams['name'];
      public age: DestoryByRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }
    }

    const relation = new Relation<DestroyByRecord>(DestroyByRecord, []);

    // @important
    // records are object.freeze when destroyed

    beforeEach(() => {
      const records = DestroyByRecord.create<DestroyByRecord, DestoryByRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]);
      // @ts-ignore
      relation.records = records;
      RecordCache.update(DestroyByRecord.name, RECORD_ALL, records);
    });

    describe('when default', () => {
      it('should correctly', () => {
        expect(relation.destroyBy()).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: true,
            age: 1,
            _newRecord: false,
            errors: {},
            id: 1,
            name: 'name_1',
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: true,
            age: 2,
            errors: {},
            _newRecord: false,
            id: 2,
            name: 'name_2',
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 3,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: true,
            _newRecord: false,
            age: 3,
            errors: {},
            id: 3,
            name: 'name_3',
          },
        ]);
        // @ts-ignore
        expect(relation.records.length).toEqual(0);
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', () => {
        expect(relation.destroyBy((self) => self.name === 'name_1')).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: true,
            _newRecord: false,
            age: 1,
            errors: {},
            id: 1,
            name: 'name_1',
          },
        ]);
        // @ts-ignore
        expect(relation.records.length).toEqual(2);
      });
    });
  });

  describe('#deleteAll', () => {
    type DeleteAllRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class DeleteAllRecord extends ActiveRecord$Base<DeleteAllRecordParams> {
      public id: DeleteAllRecordParams['id'];
      public name: DeleteAllRecordParams['name'];
      public age: DeleteAllRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }

      protected static fetchAll<T = DeleteAllRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    const records = DeleteAllRecord.create<DeleteAllRecord, DeleteAllRecordParams>([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as DeleteAllRecord[];

    const relation = new Relation<DeleteAllRecord>(DeleteAllRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when default', () => {
      it('should correctly', () => {
        expect(RecordCache.data['DeleteAllRecord'][RECORD_ALL].length).toEqual(3);
        // @ts-ignore
        expect(relation.records.length).toEqual(3);
        const result = relation.deleteAll();
        expect(result).toEqual(3);
        expect(RecordCache.data['DeleteAllRecord'][RECORD_ALL].length).toEqual(0);
        // @ts-ignore
        expect(relation.records.length).toEqual(0);
      });
    });
  });

  describe('#destroyAll', () => {
    type DestroyAllRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class DestroyAllRecord extends ActiveRecord$Base<DestroyAllRecordParams> {
      public id: DestroyAllRecordParams['id'];
      public name: DestroyAllRecordParams['name'];
      public age: DestroyAllRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }

      protected static fetchAll<T = DestroyAllRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    // Since the process called dayjs is not executed in the it block, it is necessary to explicitly mock it.
    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = DestroyAllRecord.create<DestroyAllRecord, DestroyAllRecordParams>([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as DestroyAllRecord[];

    const relation = new Relation<DestroyAllRecord>(DestroyAllRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when default', () => {
      it('should correctly', () => {
        expect(RecordCache.data['DestroyAllRecord'][RECORD_ALL].length).toEqual(3);
        const destroyedRecords = relation.destroyAll();
        expect(RecordCache.data['DestroyAllRecord'][RECORD_ALL].length).toEqual(0);
        expect(destroyedRecords[0]).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: true,
          _newRecord: false,
          age: 1,
          errors: {},
          id: 1,
          name: 'name_1',
        });
        expect(destroyedRecords[1]).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 2,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: true,
          _newRecord: false,
          age: 2,
          errors: {},
          id: 2,
          name: 'name_2',
        });
        expect(destroyedRecords[2]).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 3,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: true,
          _newRecord: false,
          age: 3,
          errors: {},
          id: 3,
          name: 'name_3',
        });
        // @ts-ignore
        expect(relation.records.length).toEqual(0);
      });
    });
  });

  describe('#findOrCreateBy', () => {
    type FindOrCreateByRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class FindOrCreateByRecord extends ActiveRecord$Base<FindOrCreateByRecordParams> {
      public id: FindOrCreateByRecordParams['id'];
      public name: FindOrCreateByRecordParams['name'];
      public age: FindOrCreateByRecordParams['age'];
    }

    // Since the process called dayjs is not executed in the it block, it is necessary to explicitly mock it.
    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = FindOrCreateByRecord.create<FindOrCreateByRecord, FindOrCreateByRecordParams>([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as FindOrCreateByRecord[];

    const relation = new Relation<FindOrCreateByRecord>(FindOrCreateByRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe("when return 'findBy' result", () => {
      it('should correctly', (done) => {
        relation
          .findOrCreateBy<FindOrCreateByRecordParams>({ name: 'name_1' })
          .then((record) => {
            expect(record).toEqual(records[0]);
            // @ts-ignore
            expect(relation.records.length).toEqual(3);
            done();
          });
      });

      describe("when specify 'yielder'", () => {
        it('should correctly', (done) => {
          relation
            .findOrCreateBy<FindOrCreateByRecordParams>({ name: 'name_1' }, (self) => {
              self.name = 'rename';
            })
            .then((record) => {
              expect(record.name).toEqual('rename');
              done();
            });
        });
      });
    });

    describe("when return 'create' result", () => {
      it('should correctly', (done) => {
        relation
          .findOrCreateBy<FindOrCreateByRecordParams>({ name: 'name_4' })
          .then((record) => {
            expect(record).toEqual({
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 4,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _newRecord: false,
              _destroyed: false,
              errors: {},
              name: 'name_4',
            });
            // @ts-ignore
            expect(relation.records.length).toEqual(4);
            done();
          });
      });

      describe("when specify 'yielder'", () => {
        it('should correctly', (done) => {
          relation
            .findOrCreateBy<FindOrCreateByRecordParams>({ name: 'name_5' }, (self) => {
              self.age = 100;
            })
            .then((record) => {
              expect(record).toEqual({
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 5,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _newRecord: false,
                _destroyed: false,
                age: 100,
                errors: {},
                name: 'name_5',
              });
              // @ts-ignore
              expect(relation.records.length).toEqual(4);
              done();
            });
        });
      });
    });
  });

  describe('#findOrCreateByOrThrow', () => {
    type FindOrCreateByOrThrowRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class FindOrCreateByOrThrowRecord extends ActiveRecord$Base<FindOrCreateByOrThrowRecordParams> {
      public id: FindOrCreateByOrThrowRecordParams['id'];
      public name: FindOrCreateByOrThrowRecordParams['name'];
      public age: FindOrCreateByOrThrowRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }
    }

    FindOrCreateByOrThrowRecord.validates('name', { length: { is: 6 } });
    FindOrCreateByOrThrowRecord.validates('age', { numericality: { lessThan: 10 } });

    const records = FindOrCreateByOrThrowRecord.create<
      FindOrCreateByOrThrowRecord,
      FindOrCreateByOrThrowRecordParams
    >([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as FindOrCreateByOrThrowRecord[];

    const relation = new Relation<FindOrCreateByOrThrowRecord>(
      FindOrCreateByOrThrowRecord,
      records
    );

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe("when return 'findBy' result", () => {
      it('should correctly', (done) => {
        relation
          .findOrCreateByOrThrow<FindOrCreateByOrThrowRecordParams>({ name: 'name_1' })
          .then((record) => {
            expect(record).toEqual({
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _newRecord: false,
              _destroyed: false,
              age: 1,
              errors: { age: [], name: [] },
              id: 1,
              name: 'name_1',
            });
            // @ts-ignore
            expect(relation.records.length).toEqual(3);
            done();
          });
      });
    });

    describe("when return 'create' result", () => {
      it('shoulld correctly', (done) => {
        relation
          .findOrCreateByOrThrow<FindOrCreateByOrThrowRecordParams>({ name: 'name_4', age: 4 })
          .then((record) => {
            expect(record).toEqual({
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 4,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _newRecord: false,
              _destroyed: false,
              age: 4,
              errors: { age: [], name: [] },
              name: 'name_4',
            });
            // @ts-ignore
            expect(relation.records.length).toEqual(4);
            done();
          });
      });
    });

    describe("when specify 'yielder'", () => {
      it('should correctly', (done) => {
        relation
          .findOrCreateByOrThrow<FindOrCreateByOrThrowRecordParams>(
            { name: 'name_5', age: 5 },
            (self) => {
              self.age = undefined;
            }
          )
          .then((record) => {
            expect(record).toEqual({
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 5,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _newRecord: false,
              _destroyed: false,
              age: undefined,
              errors: { age: [], name: [] },
              name: 'name_5',
            });
            // @ts-ignore
            expect(relation.records.length).toEqual(4);
            done();
          });
      });
    });

    describe('when reject', () => {
      it('should correctly', (done) => {
        relation
          .findOrCreateByOrThrow<FindOrCreateByOrThrowRecordParams>({ name: 'name_6' })
          .catch((err) => {
            expect(err.toString()).toEqual(`Error: FindOrCreateByOrThrowRecord {
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

  describe('#findOrInitializeBy', () => {
    type FindOrInitializeByRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class FindOrInitializeByRecord extends ActiveRecord$Base<FindOrInitializeByRecordParams> {
      public id: FindOrInitializeByRecordParams['id'];
      public name: FindOrInitializeByRecordParams['name'];
      public age: FindOrInitializeByRecordParams['age'];
    }

    const records = FindOrInitializeByRecord.create<
      FindOrInitializeByRecord,
      FindOrInitializeByRecordParams
    >([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
    ]) as FindOrInitializeByRecord[];

    const relation = new Relation<FindOrInitializeByRecord>(FindOrInitializeByRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe("when return 'findBy' result", () => {
      it('should correctly', (done) => {
        relation
          .findOrInitializeBy<FindOrInitializeByRecordParams>({ name: 'name_1' })
          .then((record) => {
            expect(record).toEqual(records[0]);
            // @ts-ignore
            expect(relation.records.length).toEqual(3);
            done();
          });
      });
    });

    describe("when return 'new' result", () => {
      it('should correctly', (done) => {
        relation
          .findOrInitializeBy<FindOrInitializeByRecordParams>({ name: 'name_4' })
          .then((record) => {
            expect(record).toEqual({
              __rue_record_id__: undefined,
              _newRecord: true,
              _destroyed: false,
              errors: {},
              name: 'name_4',
            });
            // @ts-ignore
            expect(relation.records.length).toEqual(3);
            done();
          });
      });
    });
  });

  describe('#updateAll', () => {
    type UpdateAllRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class UpdateAllRecord extends ActiveRecord$Base<UpdateAllRecordParams> {
      public id: UpdateAllRecordParams['id'];
      public name: UpdateAllRecordParams['name'];
      public age: UpdateAllRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }

      protected static fetchAll<T = UpdateAllRecord>(): T {
        // @ts-ignore
        return Promise.resolve([
          { name: 'name_1', age: 1 },
          { name: 'name_2', age: 2 },
        ]);
      }
    }

    UpdateAllRecord.validates('name', { length: { is: 6 } });
    UpdateAllRecord.validates('age', { numericality: { lessThan: 10 } });

    const records = UpdateAllRecord.create<UpdateAllRecord, UpdateAllRecordParams>([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
    ]) as UpdateAllRecord[];

    const relation = new Relation<UpdateAllRecord>(UpdateAllRecord, records);

    describe("when update 'name' failed", () => {
      it('should correctly', (done) => {
        relation.updateAll({ name: 'updateName' }).then((result) => {
          expect(result).toEqual(0);
          done();
        });
      });
    });

    describe("when update 'age' success", () => {
      it('should correctly', (done) => {
        relation.updateAll({ age: 9 }).then((result) => {
          expect(result).toEqual(2);
          done();
        });
      });
    });
  });

  describe('#touchAll', () => {
    type TouchAllRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class TouchAllRecord extends ActiveRecord$Base {
      public id: TouchAllRecordParams['id'];
      public name: TouchAllRecordParams['name'];
      public age: TouchAllRecordParams['age'];
    }

    // Since the process called dayjs is not executed in the it block, it is necessary to explicitly mock it.
    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = TouchAllRecord.create<TouchAllRecord, TouchAllRecordParams>([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
    ]) as TouchAllRecord[];

    const relation = new Relation<TouchAllRecord>(TouchAllRecord, records);

    describe('when default', () => {
      it('should correctly', (done) => {
        MockDate.set('2021-03-06T23:03:21+09:00');
        relation.touchAll<TouchAllRecordParams>().then((result) => {
          expect(result).toEqual(2);
          expect(records[0]).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-06T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            age: 1,
            errors: {},
            id: 1,
            name: 'name_1',
          });
          expect(records[1]).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-06T23:03:21+09:00',
            _newRecord: false,
            _destroyed: false,
            age: 2,
            errors: {},
            id: 2,
            name: 'name_2',
          });
          done();
        });
      });
    });

    describe("when specify 'params'", () => {
      it('should correctly', (done) => {
        MockDate.set('2021-03-06T23:03:21+09:00');
        relation
          .touchAll<TouchAllRecordParams>({ name: 'name_1' })
          .then((result) => {
            expect(result).toEqual(1);
            expect(records[0]).toEqual({
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-06T23:03:21+09:00',
              _newRecord: false,
              _destroyed: false,
              age: 1,
              errors: {},
              id: 1,
              name: 'name_1',
            });
            done();
          });
      });
    });

    describe("when specify 'opts.withCreatedAt'", () => {
      it('should correctly', (done) => {
        MockDate.set('2021-03-06T23:03:21+09:00');
        relation
          .touchAll<TouchAllRecordParams>({ name: 'name_1' }, { withCreatedAt: true })
          .then((result) => {
            expect(result).toEqual(1);
            expect(records[0]).toEqual({
              __rue_created_at__: '2021-03-06T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-06T23:03:21+09:00',
              _newRecord: false,
              _destroyed: false,
              age: 1,
              errors: {},
              id: 1,
              name: 'name_1',
            });
            done();
          });
      });
    });

    describe("when specify 'opts.time'", () => {
      it('should correctly', (done) => {
        MockDate.reset();
        const time = dayjs().format();
        relation.touchAll<TouchAllRecordParams>({ name: 'name_2' }, { time }).then((result) => {
          expect(result).toEqual(1);
          expect(records[1]).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: time,
            _newRecord: false,
            _destroyed: false,
            age: 2,
            errors: {},
            id: 2,
            name: 'name_2',
          });
          done();
        });
      });
    });
  });

  describe('#toArray (alias to toA)', () => {
    class ToARecord extends ActiveRecord$Base {}
    const records = [new ToARecord(), new ToARecord(), new ToARecord()];

    const relation = new Relation<ToARecord>(ToARecord, records);

    it('should correctly', () => {
      expect(relation.toA()).toEqual(records);
      expect(relation.toArray()).toEqual(records);
    });
  });
});
