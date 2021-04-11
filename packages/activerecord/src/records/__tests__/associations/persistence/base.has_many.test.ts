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

  get uniqueKey(): string {
    return 'PersistenceRecord';
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

  get uniqueKey(): string {
    return 'PersistenceChildRecord';
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

describe('ActiveRecord$Base (ActiveRecord$Persistence / hasMany)', () => {
  beforeEach(() => {
    PersistenceRecord.resetRecordCache();
    PersistenceChildRecord.resetRecordCache();
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('#saveWithAssociations', () => {
    describe('when success save (default: autosave === true)', () => {
      it('should correctly', async () => {
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        await record
          .children()
          .build<PersistenceChildRecordParams>({ id: 5, childName: 'child_name_5' });
        expect(await record.saveWithAssociations()).toEqual(true);
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
          "'records.PersistenceChildRecord.childName' is not equal length ('12' characters)."
        );
        await record.children().build();
        expect(await record.saveWithAssociations()).toEqual(false);
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

    describe("when 'record' is invalid", () => {
      it('should correctly', async () => {
        const errForAge = new Error("'records.PersistenceRecord.age' is not less than '10'.");
        const errForName = new Error(
          "'records.PersistenceRecord.name' is not equal length ('6' characters)."
        );
        const record = new PersistenceRecord();
        await record.children().build();
        expect(await record.saveWithAssociations()).toEqual(false);
        expect(record.errors).toEqual({ age: [errForAge], name: [errForName] });
        expect((await record.children())[0].errors).toEqual({});
      });
    });

    describe('when specify autosave === false', () => {
      type AutosaveFalseRecordParams = {
        id: t.Record$PrimaryKey;
        name: string;
        age: number;
      };

      class AutosaveFalseRecord extends ActiveRecord$Base<AutosaveFalseRecordParams> {
        public id: AutosaveFalseRecordParams['id'];
        public name: AutosaveFalseRecordParams['name'];
        public age: AutosaveFalseRecordParams['age'];
        public children: t.Record$HasMany<PersistenceChildRecord>;

        protected fetchAll(): Promise<AutosaveFalseRecordParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
            { id: 3, name: 'name_3', age: 3 },
            { id: 4, name: 'name_4', age: 4 },
          ]);
        }

        get uniqueKey(): string {
          return 'AutosaveFalseRecord';
        }
      }

      AutosaveFalseRecord.validates('name', { length: { is: 6 } });
      AutosaveFalseRecord.validates('age', { numericality: { lessThan: 10 } });

      type AutosaveFalseChildRecordParams = {
        id: t.Record$PrimaryKey;
        parentId: t.Record$ForeignKey;
        childName: string;
        childAge: number;
      };

      class AutosaveFalseChildRecord extends ActiveRecord$Base<AutosaveFalseChildRecordParams> {
        public id: AutosaveFalseChildRecordParams['id'];
        public parentId: AutosaveFalseChildRecordParams['parentId'];
        public childName: AutosaveFalseChildRecordParams['childName'];
        public childAge: AutosaveFalseChildRecordParams['childAge'];

        protected fetchAll(): Promise<AutosaveFalseChildRecordParams[]> {
          return Promise.resolve([
            { id: 1, parentId: 1, childName: 'child_name_1', childAge: 1 },
            { id: 2, parentId: 1, childName: 'child_name_2', childAge: 2 },
            { id: 3, parentId: 1, childName: 'child_name_3', childAge: 3 },
            { id: 4, parentId: 2, childName: 'child_name_4', childAge: 4 },
          ]);
        }

        get uniqueKey(): string {
          return 'AutosaveFalseChildRecord';
        }
      }

      AutosaveFalseChildRecord.validates('childName', { length: { is: 12 } });
      AutosaveFalseChildRecord.validates('childAge', {
        numericality: { lessThan: 10 },
        allow_undefined: true,
      });

      AutosaveFalseRecord.hasMany<AutosaveFalseChildRecord>('children', {
        klass: AutosaveFalseChildRecord,
        foreignKey: 'parentId',
        validate: true,
        autosave: false,
      });

      afterEach(() => {
        AutosaveFalseRecord.resetRecordCache();
        AutosaveFalseChildRecord.resetRecordCache();
      });

      it('associated records save is skipped (should return true)', async () => {
        const record = (await AutosaveFalseRecord.first<AutosaveFalseRecord>()) as AutosaveFalseRecord;
        await record
          .children()
          .build<AutosaveFalseChildRecordParams>({ id: 5, childName: 'child_name_5' });
        expect(await record.saveWithAssociations()).toEqual(true);
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
            __rue_record_id__: undefined,
            _associationCache: {},
            _destroyed: false,
            _newRecord: true,
            childName: 'child_name_5',
            errors: { childAge: [], childName: [] },
            id: 5,
            parentId: 1,
          },
        ]);
      });

      it('associated records save is skipped (should return false / validation error)', async () => {
        const errForRecord = new Error('AutosaveFalseChildRecord is invalid.');
        const errChildNameForChild = new Error(
          "'records.AutosaveFalseChildRecord.childName' is not equal length ('12' characters)."
        );
        const errChildAgeForChild = new Error(
          "'records.AutosaveFalseChildRecord.childAge' is not less than '10'."
        );
        const record = (await AutosaveFalseRecord.first<AutosaveFalseRecord>()) as AutosaveFalseRecord;
        await record.children().build<AutosaveFalseChildRecordParams>({
          id: 5,
          childName: 'invalid_name_5',
          childAge: 100,
        });
        expect(await record.saveWithAssociations()).toEqual(false);
        expect(record.errors['hasMany']['children']).toEqual([errForRecord]);
        expect(await record.children().last()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          childAge: 100,
          childName: 'invalid_name_5',
          errors: { childAge: [errChildAgeForChild], childName: [errChildNameForChild] },
          id: 5,
          parentId: 1,
        });
      });
    });
  });

  describe('#saveWithAssociationsOrThrow', () => {
    describe('when success save', () => {
      it('should correctly', async () => {
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        await record
          .children()
          .build<PersistenceChildRecordParams>({ id: 5, childName: 'child_name_5' });
        expect(await record.saveWithAssociations()).toEqual(true);
      });
    });

    describe('when throw error', () => {
      it('should correctly', async () => {
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        const err = new Error(
          "'records.PersistenceChildRecord.childName' is not equal length ('12' characters)."
        );
        await record.children().build<PersistenceChildRecordParams>();
        try {
          await record.saveWithAssociationsOrThrow();
        } catch (err) {
          expect(err.toString()).toEqual(`Error: PersistenceChildRecord {
  "_associationCache": {},
  "_destroyed": false,
  "_newRecord": true,
  "errors": {
    "childName": [
      {
        "_namespace": "@ruejs/activemodel",
        "_code": "PROPERTY_IS_NOT_EQUAL_LENGTH"
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

        get uniqueKey(): string {
          return 'DependentUndefinnedRecord';
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

        get uniqueKey(): string {
          return 'DependentUndefinnedChildRecord';
        }
      }

      DependentUndefinnedRecord.hasMany('dependentUndefined', {
        klass: DependentUndefinnedChildRecord,
        foreignKey: 'parentId',
      });

      it('should throw error', async () => {
        try {
          const record = (await DependentUndefinnedRecord.first<DependentUndefinnedRecord>()) as DependentUndefinnedRecord;
          await record.destroyWithAssociations();
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

        get uniqueKey(): string {
          return 'DependentNullifyRecord';
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

        get uniqueKey(): string {
          return 'DependentNullifyChildRecord';
        }
      }

      DependentNullifyRecord.hasMany('dependentNullify', {
        klass: DependentNullifyChildRecord,
        foreignKey: 'parentId',
        dependent: 'nullify',
      });

      it('should correctly', async () => {
        const record = (await DependentNullifyRecord.first<DependentNullifyRecord>()) as DependentNullifyRecord;
        await record.destroyWithAssociations();
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

        get uniqueKey(): string {
          return 'DependentDestroyRecord';
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

        get uniqueKey(): string {
          return 'DependentDestroyChildRecord';
        }
      }

      DependentDestroyRecord.hasMany('dependentDestroy', {
        klass: DependentDestroyChildRecord,
        foreignKey: 'parentId',
        dependent: 'destroy',
      });

      it('should correctly', async () => {
        const record = (await DependentDestroyRecord.first<DependentDestroyRecord>()) as DependentDestroyRecord;
        await record.destroyWithAssociations();
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

    describe("when 'dependent === deleteAll'", () => {
      class DependentDeleteAllRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentDeleteAll: t.Record$HasMany<DependentDeleteAllChildRecord>;

        protected fetchAll(): Promise<PersistenceRecordParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
            { id: 3, name: 'name_3', age: 3 },
            { id: 4, name: 'name_4', age: 4 },
          ]);
        }

        get uniqueKey(): string {
          return 'DependentDeleteAllRecord';
        }
      }

      class DependentDeleteAllChildRecord extends ActiveRecord$Base<PersistenceChildRecordParams> {
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

        get uniqueKey(): string {
          return 'DependentDeleteAllChildRecord';
        }
      }

      DependentDeleteAllRecord.hasMany('dependentDeleteAll', {
        klass: DependentDeleteAllChildRecord,
        foreignKey: 'parentId',
        dependent: 'deleteAll',
      });

      it('should correctly', async () => {
        const record = (await DependentDeleteAllRecord.first<DependentDeleteAllRecord>()) as DependentDeleteAllRecord;
        await record.destroyWithAssociations();
        expect(await record.dependentDeleteAll()).toEqual([]);
        expect(await DependentDeleteAllChildRecord.all()).toEqual([
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

    describe("when 'dependent === restrictWithException'", () => {
      class DependentRestrictWithExceptionRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentDeleteAll: t.Record$HasMany<DependentRestrictWithExceptionChildRecord>;

        protected fetchAll(): Promise<PersistenceRecordParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
            { id: 3, name: 'name_3', age: 3 },
            { id: 4, name: 'name_4', age: 4 },
          ]);
        }

        get uniqueKey(): string {
          return 'DependentRestrictWithExceptionRecord';
        }
      }

      class DependentRestrictWithExceptionChildRecord extends ActiveRecord$Base<PersistenceChildRecordParams> {
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

        get uniqueKey(): string {
          return 'DependentRestrictWithExceptionChildRecord';
        }
      }

      DependentRestrictWithExceptionRecord.hasMany('dependentDeleteAll', {
        klass: DependentRestrictWithExceptionChildRecord,
        foreignKey: 'parentId',
        dependent: 'restrictWithException',
      });

      it('should correctly', async () => {
        const record = (await DependentRestrictWithExceptionRecord.first<DependentRestrictWithExceptionRecord>()) as DependentRestrictWithExceptionRecord;
        try {
          await record.destroyWithAssociations();
        } catch (err) {
          expect(err.toString()).toEqual(
            "Error: Cannot delete record because of dependent 'DependentRestrictWithExceptionChildRecord' records"
          );
        }
      });
    });

    describe("when 'dependent === restrictWithError'", () => {
      class DependentRestrictWithErrorRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentDeleteAll: t.Record$HasMany<DependentRestrictWithErrorChildRecord>;

        protected fetchAll(): Promise<PersistenceRecordParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
            { id: 3, name: 'name_3', age: 3 },
            { id: 4, name: 'name_4', age: 4 },
          ]);
        }

        get uniqueKey(): string {
          return 'DependentRestrictWithErrorRecord';
        }
      }

      class DependentRestrictWithErrorChildRecord extends ActiveRecord$Base<PersistenceChildRecordParams> {
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

        get uniqueKey(): string {
          return 'DependentRestrictWithErrorChildRecord';
        }
      }

      DependentRestrictWithErrorRecord.hasMany('dependentDeleteAll', {
        klass: DependentRestrictWithErrorChildRecord,
        foreignKey: 'parentId',
        dependent: 'restrictWithError',
      });

      it('should correctly', async () => {
        const err = new Error(
          "Cannot delete record because of dependent 'DependentRestrictWithErrorChildRecord' records"
        );
        const record = (await DependentRestrictWithErrorRecord.first<DependentRestrictWithErrorRecord>()) as DependentRestrictWithErrorRecord;
        expect(await record.destroyWithAssociations()).toEqual(false);
        expect(record.errors).toEqual({ hasMany: { dependentDeleteAll: [err] } });
      });
    });
  });
});
