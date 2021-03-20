import { ActiveRecord$Base } from '@/records';

// third party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

type PersistenceRecordParams = {
  id: t.Record$PrimaryKey;
  name: string;
  age: number;
};

class PersistenceRecord extends ActiveRecord$Base<PersistenceRecordParams> {
  public id: PersistenceRecordParams['id'];
  public name: PersistenceRecordParams['name'];
  public age: PersistenceRecordParams['age'];
  public children: t.Record$HasMany<PersistenceChildRecord>;

  protected fetchAll(): Promise<PersistenceRecordParams[]> {
    return Promise.resolve([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
      { id: 4, name: 'name_4', age: 4 },
    ]);
  }
}

PersistenceRecord.validates('name', { length: { is: 6 } });
PersistenceRecord.validates('age', { numericality: { lessThan: 10 } });

type PersistenceChildRecordParams = {
  id: t.Record$PrimaryKey;
  parentId: t.Record$ForeignKey;
  childName: string;
  childAge: number;
};

class PersistenceChildRecord extends ActiveRecord$Base<PersistenceChildRecordParams> {
  public id: PersistenceChildRecordParams['id'];
  public parentId: PersistenceChildRecordParams['parentId'];
  public childName: PersistenceChildRecordParams['childName'];
  public childAge: PersistenceChildRecordParams['childAge'];

  protected fetchAll(): Promise<PersistenceChildRecordParams[]> {
    return Promise.resolve([
      { id: 1, parentId: 1, childName: 'child_name_1', childAge: 1 },
      { id: 2, parentId: 1, childName: 'child_name_2', childAge: 2 },
      { id: 3, parentId: 1, childName: 'child_name_3', childAge: 3 },
      { id: 4, parentId: 2, childName: 'child_name_4', childAge: 4 },
    ]);
  }

  static translate(key: string, opts?: any): string {
    return key;
  }
}

PersistenceChildRecord.validates('childName', { length: { is: 12 } });
PersistenceChildRecord.validates('childAge', {
  numericality: { lessThan: 10 },
  allow_undefined: true,
});

PersistenceRecord.hasMany<PersistenceChildRecord>('children', {
  klass: PersistenceChildRecord,
  foreignKey: 'parentId',
  validate: true,
});

describe('ActiveRecord$Base (ActiveRecord$Persistence)', () => {
  beforeEach(() => {
    PersistenceRecord.resetRecordCache();
    PersistenceChildRecord.resetRecordCache();
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('#save', () => {
    describe('when success save', () => {
      it('should correctly', async () => {
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        await record
          .children()
          .build<PersistenceChildRecordParams>({ id: 5, childName: 'child_name_5' });
        expect(await record.save()).toEqual(true);
        expect(await record.children()).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            childAge: 1,
            childName: 'child_name_1',
            errors: { childAge: [], childName: [] },
            id: 1,
            parentId: 1,
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            childAge: 2,
            childName: 'child_name_2',
            errors: { childAge: [], childName: [] },
            id: 2,
            parentId: 1,
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 3,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            childAge: 3,
            childName: 'child_name_3',
            errors: { childAge: [], childName: [] },
            id: 3,
            parentId: 1,
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 5,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            childName: 'child_name_5',
            errors: { childAge: [], childName: [] },
            id: 5,
            parentId: 1,
          },
        ]);
      });
    });

    describe('when failed save', () => {
      it('should correctly', async () => {
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        const err = new Error(
          "'rue.records.PersistenceChildRecord.childName' is not equal length ('12' characters)."
        );
        await record.children().build();
        expect(await record.save()).toEqual(false);
        expect(await record.children().size()).toEqual(4);
        expect(await record.children().last()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: {
            childAge: [],
            childName: [err],
          },
          parentId: 1,
        });
      });
    });
  });

  describe('#saveOrThrow', () => {
    describe('when success save', () => {
      it('should correctly', async () => {
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        await record
          .children()
          .build<PersistenceChildRecordParams>({ id: 5, childName: 'child_name_5' });
        expect(await record.save()).toEqual(true);
      });
    });

    describe('when throw error', () => {
      it('should correctly', async () => {
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        const err = new Error(
          "'rue.records.PersistenceChildRecord.childName' is not equal length ('12' characters)."
        );
        await record.children().build<PersistenceChildRecordParams>();
        try {
          await record.saveOrThrow();
        } catch (err) {
          expect(err.toString()).toEqual(`Error: PersistenceChildRecord {
  "_associationCache": {},
  "_destroyed": false,
  "_newRecord": true,
  "errors": {
    "childName": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY IS NOT EQUAL LENGTH"
      }
    ],
    "childAge": []
  },
  "parentId": 1
} is invalid.`);
        }
        expect(await record.children().size()).toEqual(4);
        expect(await record.children().last()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: { childAge: [], childName: [err] },
          parentId: 1,
        });
      });
    });
  });

  describe('#destroy', () => {
    describe("when 'dependent === undefined' (default)", () => {
      class DependentUndefinnedRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentUndefined: t.Record$HasMany<DependentUndefinnedChildRecord>;

        protected fetchAll(): Promise<PersistenceRecordParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
            { id: 3, name: 'name_3', age: 3 },
            { id: 4, name: 'name_4', age: 4 },
          ]);
        }
      }

      class DependentUndefinnedChildRecord extends ActiveRecord$Base<PersistenceChildRecordParams> {
        public id: PersistenceChildRecordParams['id'];
        public parentId: PersistenceChildRecordParams['parentId'];
        public childName: PersistenceChildRecordParams['childName'];
        public childAge: PersistenceChildRecordParams['childAge'];

        protected fetchAll(): Promise<PersistenceChildRecordParams[]> {
          return Promise.resolve([
            { id: 1, parentId: 1, childName: 'child_name_1', childAge: 1 },
            { id: 2, parentId: 1, childName: 'child_name_2', childAge: 2 },
            { id: 3, parentId: 1, childName: 'child_name_3', childAge: 3 },
            { id: 4, parentId: 2, childName: 'child_name_4', childAge: 4 },
          ]);
        }
      }

      DependentUndefinnedRecord.hasMany('dependentUndefined', {
        klass: DependentUndefinnedChildRecord,
        foreignKey: 'parentId',
      });

      it('should throw error', async () => {
        try {
          const record = (await DependentUndefinnedRecord.first<DependentUndefinnedRecord>()) as DependentUndefinnedRecord;
          await record.destroy();
        } catch (err) {
          expect(err.toString()).toEqual(
            "Error: Cannot delete or update a 'DependentUndefinnedRecord' record: a foreign key (parentId) constraint fails"
          );
        }
      });
    });

    describe("when 'dependent === nullify'", () => {
      class DependentNullifyRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentNullify: t.Record$HasMany<DependentNullifyChildRecord>;

        protected fetchAll(): Promise<PersistenceRecordParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
            { id: 3, name: 'name_3', age: 3 },
            { id: 4, name: 'name_4', age: 4 },
          ]);
        }
      }

      class DependentNullifyChildRecord extends ActiveRecord$Base<PersistenceChildRecordParams> {
        public id: PersistenceChildRecordParams['id'];
        public parentId: PersistenceChildRecordParams['parentId'];
        public childName: PersistenceChildRecordParams['childName'];
        public childAge: PersistenceChildRecordParams['childAge'];

        protected fetchAll(): Promise<PersistenceChildRecordParams[]> {
          return Promise.resolve([
            { id: 1, parentId: 1, childName: 'child_name_1', childAge: 1 },
            { id: 2, parentId: 1, childName: 'child_name_2', childAge: 2 },
            { id: 3, parentId: 1, childName: 'child_name_3', childAge: 3 },
            { id: 4, parentId: 2, childName: 'child_name_4', childAge: 4 },
          ]);
        }
      }

      DependentNullifyRecord.hasMany('dependentNullify', {
        klass: DependentNullifyChildRecord,
        foreignKey: 'parentId',
        dependent: 'nullify',
      });

      it('should correctly', async () => {
        const record = (await DependentNullifyRecord.first<DependentNullifyRecord>()) as DependentNullifyRecord;
        await record.destroy();
        expect(await record.dependentNullify()).toEqual([]);
        expect(await DependentNullifyChildRecord.all()).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            errors: {},
            id: 1,
            parentId: undefined,
            childAge: 1,
            childName: 'child_name_1',
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            errors: {},
            id: 2,
            parentId: undefined,
            childAge: 2,
            childName: 'child_name_2',
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 3,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            errors: {},
            id: 3,
            parentId: undefined,
            childAge: 3,
            childName: 'child_name_3',
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            errors: {},
            id: 4,
            parentId: 2,
            childAge: 4,
            childName: 'child_name_4',
          },
        ]);
      });
    });

    describe("when 'dependent === destroy'", () => {
      class DependentDestroyRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentDestroy: t.Record$HasMany<DependentDestroyChildRecord>;

        protected fetchAll(): Promise<PersistenceRecordParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
            { id: 3, name: 'name_3', age: 3 },
            { id: 4, name: 'name_4', age: 4 },
          ]);
        }
      }

      class DependentDestroyChildRecord extends ActiveRecord$Base<PersistenceChildRecordParams> {
        public id: PersistenceChildRecordParams['id'];
        public parentId: PersistenceChildRecordParams['parentId'];
        public childName: PersistenceChildRecordParams['childName'];
        public childAge: PersistenceChildRecordParams['childAge'];

        protected fetchAll(): Promise<PersistenceChildRecordParams[]> {
          return Promise.resolve([
            { id: 1, parentId: 1, childName: 'child_name_1', childAge: 1 },
            { id: 2, parentId: 1, childName: 'child_name_2', childAge: 2 },
            { id: 3, parentId: 1, childName: 'child_name_3', childAge: 3 },
            { id: 4, parentId: 2, childName: 'child_name_4', childAge: 4 },
          ]);
        }
      }

      DependentDestroyRecord.hasMany('dependentDestroy', {
        klass: DependentDestroyChildRecord,
        foreignKey: 'parentId',
        dependent: 'destroy',
      });

      it('should correctly', async () => {
        const record = (await DependentDestroyRecord.first<DependentDestroyRecord>()) as DependentDestroyRecord;
        await record.destroy();
        expect(await record.dependentDestroy()).toEqual([]);
        expect(await DependentDestroyChildRecord.all()).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _associationCache: {},
            _destroyed: false,
            _newRecord: false,
            errors: {},
            id: 4,
            parentId: 2,
            childAge: 4,
            childName: 'child_name_4',
          },
        ]);
      });
    });
  });
});
