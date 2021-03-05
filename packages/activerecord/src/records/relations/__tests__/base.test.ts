import { ActiveRecord$Relation$Base as Relation } from '../base';
import { ActiveRecord$Base, RECORD_ALL } from '@/records/base';
import { cacheForRecords as Cache } from '@/registries';

// third party
import MockDate from 'mockdate';

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
      name: string;
      age: number;
    };

    class IsManyRecord extends ActiveRecord$Base {
      public name: IsManyRecordParams['name'];
      public age: IsManyRecordParams['age'];
    }

    const createRecord = (params: IsManyRecordParams): IsManyRecord => {
      const record = new IsManyRecord(params);
      record.save();
      return record;
    };

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
      createRecord({ name: 'name_3', age: 3 }),
    ];

    const relation = new Relation<IsManyRecord>(IsManyRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when return true', () => {
      expect(relation.isMany()).toEqual(true);
    });

    describe('when return false', () => {
      // @ts-ignore
      relation.records = [records[0]];
      expect(relation.isMany()).toEqual(false);
    });

    describe("when specify 'filter'", () => {
      expect(relation.isMany((record) => record.age === 1)).toEqual(false);
    });
  });

  describe('#isNone', () => {
    type IsNoneRecordParams = {
      name: string;
      age: number;
    };

    class IsNoneRecord extends ActiveRecord$Base {
      public name: IsNoneRecordParams['name'];
      public age: IsNoneRecordParams['age'];
    }

    const createRecord = (params: IsNoneRecordParams): IsNoneRecord => {
      const record = new IsNoneRecord(params);
      record.save();
      return record;
    };

    const records = [createRecord({ name: 'name_1', age: 1 })];

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
      name: string;
      age: number;
    };

    class IsOneRecord extends ActiveRecord$Base {
      public name: IsOneRecordParams['name'];
      public age: IsOneRecordParams['age'];
    }

    const createRecord = (params: IsOneRecordParams): IsOneRecord => {
      const record = new IsOneRecord(params);
      record.save();
      return record;
    };

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
    ];

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
      name: string;
      age: number;
    };

    class IsAnyRecord extends ActiveRecord$Base {
      public name: IsAnyRecordParams['name'];
      public age: IsAnyRecordParams['age'];
    }

    const createRecord = (params: IsAnyRecordParams): IsAnyRecord => {
      const record = new IsAnyRecord(params);
      record.save();
      return record;
    };

    const records = [createRecord({ name: 'name_1', age: 1 })];

    const relation = new Relation<IsAnyRecord>(IsAnyRecord, records);

    describe('when return true', () => {
      expect(relation.isAny()).toEqual(true);
    });

    describe('when return false', () => {
      // @ts-ignore
      relation.records = [];
      expect(relation.isAny()).toEqual(false);
    });

    describe("when specify 'filter'", () => {
      expect(relation.isAny((record) => record.age != 1)).toEqual(false);
    });
  });

  describe('#isBlank', () => {
    type IsBlankRecordParams = {
      name: string;
      age: number;
    };

    class IsBlankRecord extends ActiveRecord$Base {
      public name: IsBlankRecordParams['name'];
      public age: IsBlankRecordParams['age'];
    }

    const createRecord = (params: IsBlankRecordParams): IsBlankRecord => {
      const record = new IsBlankRecord(params);
      record.save();
      return record;
    };

    const records = [createRecord({ name: 'name_1', age: 1 })];

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
      name: string;
      age: number;
    };

    class BuildRecord extends ActiveRecord$Base {
      public name: BuildRecordParams['name'];
      public age: BuildRecordParams['age'];
    }

    const createRecord = (params: BuildRecordParams): BuildRecord => {
      const record = new BuildRecord(params);
      record.save();
      return record;
    };

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
      createRecord({ name: 'name_3', age: 3 }),
    ];

    const relation = new Relation<BuildRecord>(BuildRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when default', () => {
      it('should correctly', () => {
        expect(relation.build()).toEqual({ __rue_record_id__: undefined, errors: {} });
        // @ts-ignore
        expect(relation.records.length).toEqual(3);
      });
    });

    describe("when specify 'params'", () => {
      it('should correctly', () => {
        expect(relation.build({ name: 'name_4', age: 4 })).toEqual({
          __rue_record_id__: undefined,
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
        ).toEqual({ __rue_record_id__: undefined, age: 5, errors: {}, name: 'name_5' });
        // @ts-ignore
        expect(relation.records.length).toEqual(3);
      });
    });
  });

  describe('#create', () => {
    type CreateRecordParams = {
      name: string;
      age: number;
    };

    class CreateRecord extends ActiveRecord$Base {
      public name: CreateRecordParams['name'];
      public age: CreateRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }
    }

    CreateRecord.validates('name', { length: { is: 6 }, allow_undefined: true });
    CreateRecord.validates('age', { numericality: { lessThan: 10 }, allow_undefined: true });

    const records = [
      new CreateRecord({ name: 'name_1', age: 1 }),
      new CreateRecord({ name: 'name_2', age: 2 }),
      new CreateRecord({ name: 'name_3', age: 3 }),
    ];

    const relation = new Relation<CreateRecord>(CreateRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
      CreateRecord.resetCache();
    });

    describe('when default', () => {
      it('should correctly', () => {
        const record = relation.create<CreateRecordParams>();
        const cacheAll = Cache.data['CreateRecord'][RECORD_ALL];
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
          const cacheAll = Cache.data['CreateRecord'][RECORD_ALL];
          expect(record.name).toEqual('name_4');
          expect(record.age).toEqual(4);
          expect(cacheAll.length).toEqual(1);
          expect(cacheAll[0]).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
          const cacheAll = Cache.data['CreateRecord'][RECORD_ALL];
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
      name: string;
      age: number;
    };

    class CreateOrThrowRecord extends ActiveRecord$Base {
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
      new CreateOrThrowRecord({ name: 'name_1', age: 1 }),
      new CreateOrThrowRecord({ name: 'name_2', age: 2 }),
      new CreateOrThrowRecord({ name: 'name_3', age: 3 }),
    ];

    const relation = new Relation<CreateOrThrowRecord>(CreateOrThrowRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
      CreateOrThrowRecord.resetCache();
    });

    describe('when default', () => {
      it('should correctly', () => {
        const record = relation.create<CreateOrThrowRecordParams>();
        const cacheAll = Cache.data['CreateOrThrowRecord'][RECORD_ALL];
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
          const cacheAll = Cache.data['CreateOrThrowRecord'][RECORD_ALL];
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
          const cacheAll = Cache.data['CreateOrThrowRecord'][RECORD_ALL];
          expect(() => {
            relation.createOrThrow<CreateOrThrowRecordParams>({ name: 'name_10', age: 10 });
          }).toThrowError(`CreateOrThrowRecord {
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
      name: string;
      age: number;
    };

    class CreateOrFindByRecord extends ActiveRecord$Base {
      public name: CreateOrFindByRecordParams['name'];
      public age: CreateOrFindByRecordParams['age'];
    }

    const createRecord = (params: CreateOrFindByRecordParams) => {
      const record = new CreateOrFindByRecord(params);
      record.save();
      return record;
    };

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
      createRecord({ name: 'name_3', age: 3 }),
    ];

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
      name: string;
      age: number;
    };

    class CreateOrFindByOrThrowRecord extends ActiveRecord$Base {
      public name: CreateOrFindByOrThrowRecordParams['name'];
      public age: CreateOrFindByOrThrowRecordParams['age'];

      static translate(key: string, opts: string): string {
        return key;
      }
    }

    CreateOrFindByOrThrowRecord.validates('name', { length: { is: 6 } });

    const createRecord = (params: CreateOrFindByOrThrowRecordParams) => {
      const record = new CreateOrFindByOrThrowRecord(params);
      record.save();
      return record;
    };

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
      createRecord({ name: 'name_3', age: 3 }),
    ];

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

  describe('#destroyBy', () => {
    type DestoryByRecordParams = {
      name: string;
      age: number;
    };

    class DestroyByRecord extends ActiveRecord$Base {
      public name: DestoryByRecordParams['name'];
      public age: DestoryByRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }
    }

    const createRecord = (params: DestoryByRecordParams): DestroyByRecord => {
      const record = new DestroyByRecord(params);
      record.save();
      return record;
    };

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
      createRecord({ name: 'name_3', age: 3 }),
    ];

    const relation = new Relation<DestroyByRecord>(DestroyByRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when default', () => {
      it('should correctly', () => {
        // @ts-ignore
        expect(relation.records.length).toEqual(3);
        expect(relation.destroyBy()).toEqual(records);
        // @ts-ignore
        expect(relation.records.length).toEqual(0);
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', () => {
        // @ts-ignore
        expect(relation.records.length).toEqual(3);
        expect(relation.destroyBy((self) => self.name === 'name_1')).toEqual([records[0]]);
        // @ts-ignore
        expect(relation.records.length).toEqual(2);
      });
    });
  });

  describe('#destroyAll', () => {
    type DestroyAllRecordParams = {
      name: string;
      age: number;
    };

    class DestroyAllRecord extends ActiveRecord$Base {
      public name: DestroyAllRecordParams['name'];
      public age: DestroyAllRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }

      protected static fetchAll<T = DestroyAllRecordParams>(): Promise<T[]> {
        return Promise.resolve([]);
      }
    }

    const createRecord = (params): DestroyAllRecord => {
      const record = new DestroyAllRecord(params);
      record.save();
      return record;
    };

    // Since the process called dayjs is not executed in the it block, it is necessary to explicitly mock it.
    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
      createRecord({ name: 'name_3', age: 3 }),
    ];

    const relation = new Relation<DestroyAllRecord>(DestroyAllRecord, records);

    beforeEach(() => {
      // @ts-ignore
      relation.records = Array.from(records);
    });

    describe('when default', () => {
      it('should correctly', () => {
        expect(Cache.data['DestroyAllRecord'][RECORD_ALL].length).toEqual(3);
        const destroyedRecords = relation.destroyAll();
        expect(Cache.data['DestroyAllRecord'][RECORD_ALL].length).toEqual(0);
        expect(destroyedRecords[0]).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          age: 1,
          errors: {},
          name: 'name_1',
        });
        expect(destroyedRecords[1]).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 2,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          age: 2,
          errors: {},
          name: 'name_2',
        });
        expect(destroyedRecords[2]).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 3,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          age: 3,
          errors: {},
          name: 'name_3',
        });
        // @ts-ignore
        expect(relation.records.length).toEqual(0);
      });
    });
  });

  describe('#findOrCreateBy', () => {
    type FindOrCreateByRecordParams = {
      name: string;
      age: number;
    };

    class FindOrCreateByRecord extends ActiveRecord$Base {
      public name: FindOrCreateByRecordParams['name'];
      public age: FindOrCreateByRecordParams['age'];
    }

    const createRecord = (params): FindOrCreateByRecord => {
      const record = new FindOrCreateByRecord(params);
      record.save();
      return record;
    };

    // Since the process called dayjs is not executed in the it block, it is necessary to explicitly mock it.
    MockDate.set('2021-03-05T23:03:21+09:00');

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
      createRecord({ name: 'name_3', age: 3 }),
    ];

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
      name: string;
      age: number;
    };

    class FindOrCreateByOrThrowRecord extends ActiveRecord$Base {
      public name: FindOrCreateByOrThrowRecordParams['name'];
      public age: FindOrCreateByOrThrowRecordParams['age'];

      static translate(key: string, opts?: any): string {
        return key;
      }
    }

    FindOrCreateByOrThrowRecord.validates('name', { length: { is: 6 } });
    FindOrCreateByOrThrowRecord.validates('age', { numericality: { lessThan: 10 } });

    const createRecord = (
      params: FindOrCreateByOrThrowRecordParams
    ): FindOrCreateByOrThrowRecord => {
      const record = new FindOrCreateByOrThrowRecord(params);
      record.save();
      return record;
    };

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
      createRecord({ name: 'name_3', age: 3 }),
    ];

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
              age: 1,
              errors: { age: [], name: [] },
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
      name: string;
      age: number;
    };

    class FindOrInitializeByRecord extends ActiveRecord$Base {
      public name: FindOrInitializeByRecordParams['name'];
      public age: FindOrInitializeByRecordParams['age'];
    }

    const createRecord = (params: FindOrInitializeByRecordParams): FindOrInitializeByRecord => {
      const record = new FindOrInitializeByRecord(params);
      record.save();
      return record;
    };

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
      createRecord({ name: 'name_3', age: 3 }),
    ];

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
            expect(record).toEqual({ __rue_record_id__: undefined, errors: {}, name: 'name_4' });
            // @ts-ignore
            expect(relation.records.length).toEqual(3);
            done();
          });
      });
    });
  });

  describe('#updateAll', () => {
    type UpdateAllRecordParams = {
      name: string;
      age: number;
    };

    class UpdateAllRecord extends ActiveRecord$Base {
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

    const createRecord = (params: UpdateAllRecordParams): UpdateAllRecord => {
      const record = new UpdateAllRecord(params);
      record.save();
      return record;
    };

    const records = [
      createRecord({ name: 'name_1', age: 1 }),
      createRecord({ name: 'name_2', age: 2 }),
    ];

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
