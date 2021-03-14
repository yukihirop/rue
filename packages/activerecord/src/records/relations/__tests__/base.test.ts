import { ActiveRecord$Relation$Base as Relation } from '../base';
import { ActiveRecord$Relation$Holder as Holder } from '../holder';
import { ActiveRecord$Base, RECORD_ALL } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';

// third party
import MockDate from 'mockdate';
import dayjs from 'dayjs';

// types
import type * as t from '@/index';

describe('ActiveRecord$Relation$Base', () => {
  // https://github.com/iamkun/dayjs/blob/dev/test/parse.test.js#L6
  beforeEach(() => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('costructor', () => {
    class ConstructorRecord extends ActiveRecord$Base {}

    const records = [new ConstructorRecord(), new ConstructorRecord(), new ConstructorRecord()];
    it('should correctly', () => {
      const holder = new Holder(ConstructorRecord, []);
      const relation = new Relation<ConstructorRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(ConstructorRecord);
      // @ts-ignore
      expect(typeof relation.recordKlass === 'function').toEqual(true);
      // @ts-ignore
      expect(relation.recordKlass.name).toEqual('ConstructorRecord');
      expect(holder.scope).toEqual([]);
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

    let records: IsManyRecord[];
    let holder: Holder<IsManyRecord>;
    let relation: Relation<IsManyRecord>;

    beforeEach(() => {
      IsManyRecord.resetRecordCache();

      records = IsManyRecord.create<IsManyRecord, IsManyRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as IsManyRecord[];

      holder = new Holder(IsManyRecord, records);
      relation = new Relation<IsManyRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(IsManyRecord);
    });

    describe('when return true', () => {
      it('should correctly', (done) => {
        relation.isMany().then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        relation
          .where({ id: 1 })
          .isMany()
          .then((result) => {
            expect(result).toEqual(false);
            done();
          });
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', (done) => {
        relation
          .isMany((record) => record.age === 1)
          .then((result) => {
            expect(result).toEqual(false);
            done();
          });
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

    let records: IsNoneRecord[];
    let holder: Holder<IsNoneRecord>;
    let relation: Relation<IsNoneRecord>;

    beforeEach(() => {
      IsNoneRecord.resetRecordCache();

      records = [
        IsNoneRecord.create<IsNoneRecord, IsNoneRecordParams>({
          id: 1,
          name: 'name_1',
          age: 1,
        }) as IsNoneRecord,
      ];

      holder = new Holder(IsNoneRecord, records);
      relation = new Relation<IsNoneRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(IsNoneRecord);
    });

    describe('when return true', () => {
      it('should correctly', (done) => {
        relation
          .where({ id: 100 })
          .isNone()
          .then((result) => {
            expect(result).toEqual(true);
            done();
          });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        relation.isNone().then((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', (done) => {
        relation
          .isNone((record) => record.age > 4)
          .then((result) => {
            expect(result).toEqual(true);
            done();
          });
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

    let records: IsOneRecord[];
    let holder: Holder<IsOneRecord>;
    let relation: Relation<IsOneRecord>;

    beforeEach(() => {
      IsOneRecord.resetRecordCache();

      records = IsOneRecord.create<IsOneRecord, IsOneRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
      ]) as IsOneRecord[];

      holder = new Holder(IsOneRecord, records);
      relation = new Relation<IsOneRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(IsOneRecord);
    });

    describe('when return true', () => {
      it('should correctly', (done) => {
        relation
          .where({ id: 1 })
          .isOne()
          .then((result) => {
            expect(result).toEqual(true);
            done();
          });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        relation.isOne().then((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', (done) => {
        relation
          .isOne((record) => record.age === 1)
          .then((result) => {
            expect(result).toEqual(true);
            done();
          });
      });
    });
  });

  describe('#size', () => {
    type SizeRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class SizeRecord extends ActiveRecord$Base<SizeRecordParams> {
      public id: SizeRecordParams['id'];
      public name: SizeRecordParams['name'];
      public age: SizeRecordParams['age'];
    }

    let records: SizeRecord[];
    let holder: Holder<SizeRecord>;
    let relation: Relation<SizeRecord>;

    beforeEach(() => {
      SizeRecord.resetRecordCache();

      records = SizeRecord.create<SizeRecord, SizeRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as SizeRecord[];

      holder = new Holder(SizeRecord, records);
      relation = new Relation<SizeRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(SizeRecord);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.size().then((result) => {
          expect(result).toEqual(3);
          done();
        });
      });
    });

    describe('when mix', () => {
      it('should correctly', (done) => {
        relation
          .limit(2)
          .size()
          .then((result) => {
            expect(result).toEqual(2);
            done();
          });
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

    let records: IsAnyRecord[];
    let holder: Holder<IsAnyRecord>;
    let relation: Relation<IsAnyRecord>;

    beforeEach(() => {
      IsAnyRecord.resetRecordCache();

      records = [IsAnyRecord.create({ name: 'name_1', age: 1 }) as IsAnyRecord];

      holder = new Holder(IsAnyRecord, records);
      relation = new Relation<IsAnyRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(IsAnyRecord);
    });

    describe('when return true', () => {
      it('should correctly', (done) => {
        relation.isAny().then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        relation
          .where({ id: 100 })
          .isAny()
          .then((result) => {
            expect(result).toEqual(false);
            done();
          });
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', (done) => {
        relation
          .isAny((record) => record.age != 1)
          .then((result) => {
            expect(result).toEqual(false);
            done();
          });
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

    let records: IsBlankRecord[];
    let holder: Holder<IsBlankRecord>;
    let relation: Relation<IsBlankRecord>;

    beforeEach(() => {
      IsBlankRecord.resetRecordCache();

      records = IsBlankRecord.create([
        { id: 1, name: 'name_1', age: 1 },
        { id: 1, name: 'name_2', age: 2 },
        { id: 1, name: 'name_3', age: 3 },
      ]) as IsBlankRecord[];

      holder = new Holder(IsBlankRecord, records);
      relation = new Relation<IsBlankRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(IsBlankRecord);
    });

    describe('when return true', () => {
      it('should correctly', (done) => {
        holder = new Holder(IsBlankRecord, []);
        relation = new Relation<IsBlankRecord>(
          (resolve, _reject) => resolve([holder, []])
          // @ts-expect-error
        )._init(IsBlankRecord);
        relation.isBlank().then((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        relation.isBlank().then((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });
  });

  describe('#IsEmpty', () => {
    type IsEmptyRecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class IsEmptyRecord extends ActiveRecord$Base<IsEmptyRecordParams> {
      public id: IsEmptyRecordParams['id'];
      public name: IsEmptyRecordParams['name'];
      public age: IsEmptyRecordParams['age'];
    }

    let records: IsEmptyRecord[];
    let holder: Holder<IsEmptyRecord>;
    let relation: Relation<IsEmptyRecord>;

    beforeEach(() => {
      IsEmptyRecord.resetRecordCache();

      records = [
        IsEmptyRecord.create<IsEmptyRecord, IsEmptyRecordParams>({
          id: 1,
          name: 'name_1',
          age: 1,
        }) as IsEmptyRecord,
      ];

      holder = new Holder(IsEmptyRecord, records);
      relation = new Relation<IsEmptyRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(IsEmptyRecord);
    });

    describe('when return true', () => {
      it('should correctly', (done) => {
        relation
          .where({ id: 100 })
          .isEmpty()
          .then((result) => {
            expect(result).toEqual(true);
            done();
          });
      });
    });

    describe('when return false', () => {
      it('should correctly', (done) => {
        relation.isEmpty().then((result) => {
          expect(result).toEqual(false);
          done();
        });
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

    let records: BuildRecord[];
    let holder: Holder<BuildRecord>;
    let relation: Relation<BuildRecord>;

    beforeEach(() => {
      BuildRecord.resetRecordCache();

      records = BuildRecord.create<BuildRecord, BuildRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as BuildRecord[];

      holder = new Holder(BuildRecord, records);
      relation = new Relation<BuildRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(BuildRecord);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.build().then((record) => {
          expect(record).toEqual({
            __rue_record_id__: undefined,
            _destroyed: false,
            _newRecord: true,
            errors: {},
          });
          expect(holder.scope.length).toEqual(4);
          done();
        });
      });
    });

    describe("when specify 'params'", () => {
      it('should correctly', (done) => {
        relation.build({ name: 'name_4', age: 4 }).then((record) => {
          expect(record).toEqual({
            __rue_record_id__: undefined,
            _destroyed: false,
            _newRecord: true,
            age: 4,
            errors: {},
            name: 'name_4',
          });
          expect(holder.scope.length).toEqual(4);
          done();
        });
      });
    });

    describe("when specify 'array of params'", () => {
      it('should correctly', (done) => {
        relation
          .build([
            { name: 'name_4', age: 4 },
            { name: 'name_5', age: 5 },
          ])
          .then((records) => {
            expect(records).toEqual([
              {
                __rue_record_id__: undefined,
                _destroyed: false,
                _newRecord: true,
                age: 4,
                errors: {},
                name: 'name_4',
              },
              {
                __rue_record_id__: undefined,
                _destroyed: false,
                _newRecord: true,
                age: 5,
                errors: {},
                name: 'name_5',
              },
            ]);
            expect(holder.scope.length).toEqual(5);
            done();
          });
      });
    });

    describe("when specify 'yielder'", () => {
      it('shoulld correctly', (done) => {
        relation
          .build({ name: 'name_5' }, (self) => {
            self.age = 5;
          })
          .then((record) => {
            expect(record).toEqual({
              __rue_record_id__: undefined,
              _destroyed: false,
              _newRecord: true,
              age: 5,
              errors: {},
              name: 'name_5',
            });
            expect(holder.scope.length).toEqual(4);
            done();
          });
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

    let records: CreateRecord[];
    let holder: Holder<CreateRecord>;
    let relation: Relation<CreateRecord>;

    beforeEach(() => {
      CreateRecord.resetRecordCache();

      records = CreateRecord.create<CreateRecord, CreateRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as CreateRecord[];

      holder = new Holder(CreateRecord, records);
      relation = new Relation<CreateRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(CreateRecord);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.create<CreateRecordParams>().then((record: CreateRecord) => {
          const cacheAll = RecordCache.data['CreateRecord'][RECORD_ALL];
          expect(cacheAll.length).toEqual(4);
          expect(record).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            errors: { age: [], name: [] },
          });
          expect(holder.scope.length).toEqual(4);
          done();
        });
      });
    });

    describe("when specify 'params'", () => {
      describe('when valid', () => {
        it('should correctly', (done) => {
          relation
            .create<CreateRecordParams>({ name: 'name_4', age: 4 })
            .then((record: CreateRecord) => {
              const cacheAll = RecordCache.data['CreateRecord'][RECORD_ALL];
              expect(cacheAll.length).toEqual(4);
              expect(record).toEqual({
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 4,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 4,
                errors: { age: [], name: [] },
                name: 'name_4',
              });
              expect(holder.scope.length).toEqual(4);
              done();
            });
        });
      });

      describe('when invalid', () => {
        it('should correctly', (done) => {
          relation
            .create<CreateRecordParams>({ name: 'name_10', age: 10 })
            .then((record: CreateRecord) => {
              const cacheAll = RecordCache.data[CreateRecord.name][RECORD_ALL];
              expect(record.name).toEqual('name_10');
              expect(record.age).toEqual(10);
              expect(cacheAll.length).toEqual(3);
              expect(holder.scope.length).toEqual(4);
              done();
            });
        });
      });
    });

    describe("when specify 'array of params'", () => {
      it('should correctly', (done) => {
        relation
          .create<CreateRecordParams>([
            { id: 4, name: 'name_4', age: 4 },
            { id: 5, name: 'name_5', age: 5 },
          ])
          .then((records: CreateRecord[]) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 4,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 4,
                errors: { age: [], name: [] },
                id: 4,
                name: 'name_4',
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 5,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 5,
                errors: { age: [], name: [] },
                id: 5,
                name: 'name_5',
              },
            ]);
            done();
          });
      });
    });

    describe("when specify 'yielder'", () => {
      it('should correctly', (done) => {
        relation
          .create<CreateRecordParams>({ id: 4, name: 'name_4' }, (self) => {
            self.age = 4;
          })
          .then((record: CreateRecord) => {
            expect(record).toEqual({
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 4,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 4,
              errors: { age: [], name: [] },
              id: 4,
              name: 'name_4',
            });
            done();
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

    let records: CreateOrThrowRecord[];
    let holder: Holder<CreateOrThrowRecord>;
    let relation: Relation<CreateOrThrowRecord>;

    beforeEach(() => {
      CreateOrThrowRecord.resetRecordCache();

      records = [
        new CreateOrThrowRecord({ id: 1, name: 'name_1', age: 1 }),
        new CreateOrThrowRecord({ id: 2, name: 'name_2', age: 2 }),
        new CreateOrThrowRecord({ id: 3, name: 'name_3', age: 3 }),
      ];

      holder = new Holder(CreateOrThrowRecord, records);
      relation = new Relation<CreateOrThrowRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(CreateOrThrowRecord);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.createOrThrow<CreateOrThrowRecordParams>().then((record: CreateOrThrowRecord) => {
          const cacheAll = RecordCache.data[CreateOrThrowRecord.name][RECORD_ALL];
          expect(record.name).toEqual(undefined);
          expect(record.age).toEqual(undefined);
          expect(cacheAll.length).toEqual(1);
          expect(cacheAll[0].name).toEqual(undefined);
          expect(cacheAll[0].age).toEqual(undefined);
          expect(holder.scope.length).toEqual(4);
          done();
        });
      });
    });

    describe("when specify 'params'", () => {
      describe('when valid', () => {
        it('should correctly', (done) => {
          relation
            .createOrThrow<CreateOrThrowRecordParams>({
              name: 'name_4',
              age: 4,
            })
            .then((record) => {
              const cacheAll = RecordCache.data['CreateOrThrowRecord'][RECORD_ALL];
              expect(record.name).toEqual('name_4');
              expect(record.age).toEqual(4);
              expect(cacheAll.length).toEqual(1);
              expect(cacheAll[0].name).toEqual('name_4');
              expect(cacheAll[0].age).toEqual(4);
              expect(holder.scope.length).toEqual(4);
              done();
            });
        });
      });

      describe('when invalid', () => {
        it('should correctly', (done) => {
          relation
            .createOrThrow<CreateOrThrowRecordParams>({ name: 'name_10', age: 10 })
            .catch((err) => {
              expect(err.toString()).toEqual(`Error: CreateOrThrowRecord {
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
              const cacheAll = RecordCache.data[CreateOrThrowRecord.name][RECORD_ALL];
              expect(cacheAll.length).toEqual(0);
              expect(holder.scope.length).toEqual(4);
              done();
            });
        });
      });

      describe("when specify 'array of params'", () => {
        it('should correctly', (done) => {
          relation
            .createOrThrow<CreateOrThrowRecordParams>([
              { id: 4, name: 'name_4', age: 4 },
              { id: 5, name: 'name_5', age: 5 },
            ])
            .then((records) => {
              expect(records).toEqual([
                {
                  __rue_created_at__: '2021-03-05T23:03:21+09:00',
                  __rue_record_id__: 1,
                  __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                  _destroyed: false,
                  _newRecord: false,
                  age: 4,
                  errors: { age: [], name: [] },
                  id: 4,
                  name: 'name_4',
                },
                {
                  __rue_created_at__: '2021-03-05T23:03:21+09:00',
                  __rue_record_id__: 2,
                  __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                  _destroyed: false,
                  _newRecord: false,
                  age: 5,
                  errors: { age: [], name: [] },
                  id: 5,
                  name: 'name_5',
                },
              ]);
              done();
            });
        });
      });

      describe("when specify 'yielder'", () => {
        it('should correctly', (done) => {
          relation
            .createOrThrow({ id: 4, name: 'name_4' }, (self) => {
              self.age = 4;
            })
            .then((record) => {
              expect(record).toEqual({
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 4,
                errors: { age: [], name: [] },
                id: 4,
                name: 'name_4',
              });
              done();
            });
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

    let records: CreateOrFindByRecord[];
    let holder: Holder<CreateOrFindByRecord>;
    let relation: Relation<CreateOrFindByRecord>;

    beforeEach(() => {
      CreateOrFindByRecord.resetRecordCache();

      records = CreateOrFindByRecord.create<CreateOrFindByRecord, CreateOrFindByRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 1, name: 'name_2', age: 2 },
        { id: 1, name: 'name_3', age: 3 },
      ]) as CreateOrFindByRecord[];

      holder = new Holder(CreateOrFindByRecord, records);
      relation = new Relation<CreateOrFindByRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(CreateOrFindByRecord);
    });

    describe('when return findBy result', () => {
      it('should correctly', (done) => {
        relation.createOrFindBy({ name: 'name_1' }).then((record) => {
          expect(record).toEqual(records[0]);
          expect(holder.scope.length).toEqual(3);
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
          expect(holder.scope.length).toEqual(4);
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

    let records: CreateOrFindByOrThrowRecord[];
    let holder: Holder<CreateOrFindByOrThrowRecord>;
    let relation: Relation<CreateOrFindByOrThrowRecord>;

    beforeEach(() => {
      CreateOrFindByOrThrowRecord.resetRecordCache();

      records = CreateOrFindByOrThrowRecord.create<
        CreateOrFindByOrThrowRecord,
        CreateOrFindByOrThrowRecordParams
      >([
        { id: 1, name: 'name_1', age: 1 },
        { id: 1, name: 'name_2', age: 2 },
        { id: 1, name: 'name_3', age: 3 },
      ]) as CreateOrFindByOrThrowRecord[];

      holder = new Holder(CreateOrFindByOrThrowRecord, records);
      relation = new Relation<CreateOrFindByOrThrowRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(CreateOrFindByOrThrowRecord);
    });

    describe('when return findBy result', () => {
      it('should correctly', (done) => {
        relation.createOrFindByOrThrow({ name: 'name_1' }).then((record) => {
          expect(record).toEqual(records[0]);
          expect(holder.scope.length).toEqual(3);
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
          expect(holder.scope.length).toEqual(4);
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
          expect(holder.scope.length).toEqual(4);
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

      protected fetchAll(): Promise<DeleteByRecordParams[]> {
        return Promise.resolve([]);
      }
    }

    let records: DeleteByRecord[];
    let holder: Holder<DeleteByRecord>;
    let relation: Relation<DeleteByRecord>;

    // @important
    // records are object.freeze when destroyed

    beforeEach(() => {
      DeleteByRecord.resetRecordCache();

      records = DeleteByRecord.create<DeleteByRecord, DeleteByRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as DeleteByRecord[];
      holder = new Holder(DeleteByRecord, records);
      relation = new Relation<DeleteByRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(DeleteByRecord);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.deleteBy().then((result) => {
          expect(result).toEqual(3);
          /**
           * @description Evaluator does not update holder.scope when calling deleteBy alone
           */
          expect(holder.scope.length).toEqual(3);
          done();
        });
      });
    });

    describe("when specify 'params'", () => {
      it('should correctly', (done) => {
        relation.deleteBy({ age: [1, 2] }).then((result) => {
          expect(result).toEqual(2);
          /**
           * @description Evaluator does not update holder.scope when calling deleteBy alone
           */
          expect(holder.scope.length).toEqual(3);
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

    let records: DestroyByRecord[];
    let holder: Holder<DestroyByRecord>;
    let relation: Relation<DestroyByRecord>;

    holder = new Holder(DestroyByRecord, []);
    relation = new Relation<DestroyByRecord>(
      (resolve, _reject) => resolve([holder, []])
      // @ts-expect-error
    )._init(DestroyByRecord);

    // @important
    // records are object.freeze when destroyed

    beforeEach(() => {
      RecordCache.destroy(DestroyByRecord.name);
      records = DestroyByRecord.create<DestroyByRecord, DestoryByRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as DestroyByRecord[];
      holder = new Holder(DestroyByRecord, records);
      relation = new Relation<DestroyByRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(DestroyByRecord);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.destroyBy().then((records) => {
          expect(records).toEqual([
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
          expect(holder.scope.length).toEqual(0);
          done();
        });
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', (done) => {
        relation
          .destroyBy((self) => self.name === 'name_1')
          .then((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: true,
                _newRecord: false,
                age: 1,
                errors: {},
                id: 1,
                name: 'name_1',
              },
            ]);
            expect(holder.scope.length).toEqual(2);
            done();
          });
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

      protected fetchAll(): Promise<DeleteAllRecordParams[]> {
        return Promise.resolve([]);
      }
    }

    let records: DeleteAllRecord[];
    let holder: Holder<DeleteAllRecord>;
    let relation: Relation<DeleteAllRecord>;

    beforeEach(() => {
      DeleteAllRecord.resetRecordCache();

      records = DeleteAllRecord.create<DeleteAllRecord, DeleteAllRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as DeleteAllRecord[];

      holder = new Holder(DeleteAllRecord, records);
      relation = new Relation<DeleteAllRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(DeleteAllRecord);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        expect(RecordCache.data[DeleteAllRecord.name][RECORD_ALL].length).toEqual(3);
        expect(holder.scope.length).toEqual(3);
        relation.deleteAll().then((result) => {
          expect(result).toEqual(3);
          expect(RecordCache.data[DeleteAllRecord.name][RECORD_ALL].length).toEqual(0);
          expect(holder.scope.length).toEqual(0);
          done();
        });
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

      protected fetchAll(): Promise<DestroyAllRecordParams[]> {
        return Promise.resolve([]);
      }
    }

    let records: DestroyAllRecord[];
    let holder: Holder<DestroyAllRecord>;
    let relation: Relation<DestroyAllRecord>;

    beforeEach(() => {
      DestroyAllRecord.resetRecordCache();

      records = DestroyAllRecord.create<DestroyAllRecord, DestroyAllRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as DestroyAllRecord[];

      holder = new Holder(DestroyAllRecord, records);
      relation = new Relation<DestroyAllRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(DestroyAllRecord);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        expect(RecordCache.data[DestroyAllRecord.name][RECORD_ALL].length).toEqual(3);
        relation.destroyAll().then((destroyedRecords) => {
          expect(RecordCache.data[DestroyAllRecord.name][RECORD_ALL].length).toEqual(0);
          expect(destroyedRecords).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: true,
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
              _destroyed: true,
              _newRecord: false,
              age: 2,
              errors: {},
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
          expect(holder.scope.length).toEqual(0);
          done();
        });
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

    let records: FindOrCreateByRecord[];
    let holder: Holder<FindOrCreateByRecord>;
    let relation: Relation<FindOrCreateByRecord>;

    beforeEach(() => {
      RecordCache.destroy(FindOrCreateByRecord.name);

      records = FindOrCreateByRecord.create<FindOrCreateByRecord, FindOrCreateByRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as FindOrCreateByRecord[];

      holder = new Holder(FindOrCreateByRecord, records);
      relation = new Relation<FindOrCreateByRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(FindOrCreateByRecord);
    });

    describe("when return 'findBy' result", () => {
      it('should correctly', (done) => {
        relation
          .findOrCreateBy<FindOrCreateByRecordParams>({ name: 'name_1' })
          .then((record) => {
            expect(record).toEqual(records[0]);
            /**
             * @description records after being narrowed down by the condition of findBy
             */
            expect(holder.scope.length).toEqual(1);
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
            /**
             * @description The '{ name: 'name_4' }' passed as an argument is called a scope parameter and is passed to where, and the scope is evaluated and narrowed down to one.
             */
            expect(holder.scope.length).toEqual(1);
            done();
          });
      });

      describe("when specify 'yielder'", () => {
        it('should correctly', (done) => {
          relation
            .findOrCreateBy<FindOrCreateByRecordParams>({ name: 'name_4' }, (self) => {
              self.age = 100;
            })
            .then((record) => {
              expect(record).toEqual({
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 4,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _newRecord: false,
                _destroyed: false,
                age: 100,
                errors: {},
                name: 'name_4',
              });
              /**
               * @description The '{ name: 'name_4' }' passed as an argument is called a scope parameter and is passed to where, and the scope is evaluated and narrowed down to one.
               */
              expect(holder.scope.length).toEqual(1);
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

    let records: FindOrCreateByOrThrowRecord[];
    let holder: Holder<FindOrCreateByOrThrowRecord>;
    let relation: Relation<FindOrCreateByOrThrowRecord>;

    beforeEach(() => {
      FindOrCreateByOrThrowRecord.resetRecordCache();

      records = FindOrCreateByOrThrowRecord.create<
        FindOrCreateByOrThrowRecord,
        FindOrCreateByOrThrowRecordParams
      >([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as FindOrCreateByOrThrowRecord[];

      holder = new Holder(FindOrCreateByOrThrowRecord, records);
      relation = new Relation<FindOrCreateByOrThrowRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(FindOrCreateByOrThrowRecord);
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
            expect(holder.scope.length).toEqual(3);
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
            expect(holder.scope.length).toEqual(4);
            done();
          });
      });
    });

    describe("when specify 'yielder'", () => {
      it('should correctly', (done) => {
        relation
          .findOrCreateByOrThrow<FindOrCreateByOrThrowRecordParams>(
            { name: 'name_4', age: 4 },
            (self) => {
              self.age = undefined;
            }
          )
          .then((record) => {
            expect(record).toEqual({
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 4,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _newRecord: false,
              _destroyed: false,
              age: undefined,
              errors: { age: [], name: [] },
              name: 'name_4',
            });
            expect(holder.scope.length).toEqual(4);
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

    let records: FindOrInitializeByRecord[];
    let holder: Holder<FindOrInitializeByRecord>;
    let relation: Relation<FindOrInitializeByRecord>;

    beforeEach(() => {
      FindOrInitializeByRecord.resetRecordCache();

      records = FindOrInitializeByRecord.create<
        FindOrInitializeByRecord,
        FindOrInitializeByRecordParams
      >([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
      ]) as FindOrInitializeByRecord[];

      holder = new Holder(FindOrInitializeByRecord, records);
      relation = new Relation<FindOrInitializeByRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(FindOrInitializeByRecord);
    });

    describe("when return 'findBy' result", () => {
      it('should correctly', (done) => {
        relation
          .findOrInitializeBy<FindOrInitializeByRecordParams>({ name: 'name_1' })
          .then((record) => {
            expect(record).toEqual(records[0]);
            expect(holder.scope.length).toEqual(3);
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
            expect(holder.scope.length).toEqual(3);
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

      protected fetchAll(): Promise<UpdateAllRecordParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }

    UpdateAllRecord.validates('name', { length: { is: 6 } });
    UpdateAllRecord.validates('age', { numericality: { lessThan: 10 } });

    let records: UpdateAllRecord[];
    let holder: Holder<UpdateAllRecord>;
    let relation: Relation<UpdateAllRecord>;

    beforeEach(() => {
      UpdateAllRecord.resetRecordCache();

      records = UpdateAllRecord.create<UpdateAllRecord, UpdateAllRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
      ]) as UpdateAllRecord[];

      holder = new Holder(UpdateAllRecord, records);
      relation = new Relation<UpdateAllRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(UpdateAllRecord);
    });

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

    class TouchAllRecord extends ActiveRecord$Base<TouchAllRecordParams> {
      public id: TouchAllRecordParams['id'];
      public name: TouchAllRecordParams['name'];
      public age: TouchAllRecordParams['age'];
    }

    let records: TouchAllRecord[];
    let holder: Holder<TouchAllRecord>;
    let relation: Relation<TouchAllRecord>;

    beforeEach(() => {
      TouchAllRecord.resetRecordCache();

      records = TouchAllRecord.create<TouchAllRecord, TouchAllRecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
      ]) as TouchAllRecord[];

      holder = new Holder(TouchAllRecord, records);
      relation = new Relation<TouchAllRecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(TouchAllRecord);
    });

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

  describe('#toA (alias to toArray)', () => {
    type ToARecordParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class ToARecord extends ActiveRecord$Base<ToARecordParams> {
      public id: ToARecordParams['id'];
      public name: ToARecordParams['name'];
      public age: ToARecordParams['age'];
    }

    let records: ToARecord[];
    let holder: Holder<ToARecord>;
    let relation: Relation<ToARecord>;

    beforeEach(() => {
      ToARecord.resetRecordCache();

      records = ToARecord.create<ToARecord, ToARecordParams>([
        { id: 1, name: 'name_1', age: 1 },
        { id: 2, name: 'name_2', age: 2 },
        { id: 3, name: 'name_3', age: 3 },
        { id: 4, name: 'name_4', age: 4 },
      ]) as ToARecord[];

      holder = new Holder(ToARecord, records);
      relation = new Relation<ToARecord>(
        (resolve, _reject) => resolve([holder, records])
        // @ts-expect-error
      )._init(ToARecord);
    });

    describe('when default', () => {
      it('should correctly', (done) => {
        relation.toA().then((records) => {
          expect(records).toEqual([
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 1,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
              _destroyed: false,
              _newRecord: false,
              age: 2,
              errors: {},
              id: 2,
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
              id: 3,
              name: 'name_3',
            },
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 4,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              age: 4,
              errors: {},
              id: 4,
              name: 'name_4',
            },
          ]);
          done();
        });
      });
    });

    describe('when advanced', () => {
      it('should correctly', (done) => {
        relation
          .where({ id: [1, 2, 3] })
          .order({ id: 'desc' })
          .limit(2)
          .offset(1)
          .toArray()
          .then((records) => {
            expect(records).toEqual([
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 2,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
                _destroyed: false,
                _newRecord: false,
                age: 2,
                errors: {},
                id: 2,
                name: 'name_2',
              },
              {
                __rue_created_at__: '2021-03-05T23:03:21+09:00',
                __rue_record_id__: 1,
                __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
      });
    });
  });
});
