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

type PersistenceOneRecordParams = {
  id: t.Record$PrimaryKey;
  parentId: t.Record$ForeignKey;
  oneName: string;
  oneAge: number;
};

class PersistenceRecord extends ActiveRecord$Base<PersistenceRecordParams> {
  public id: PersistenceRecordParams['id'];
  public name: PersistenceRecordParams['name'];
  public age: PersistenceRecordParams['age'];
  public one: t.Record$HasOne<PersistenceOneRecord>;

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

  buildOne(params?: Partial<PersistenceOneRecordParams>): Promise<PersistenceOneRecord> {
    return this.buildHasOneRecord<PersistenceOneRecord>('one', params);
  }
}

PersistenceRecord.validates('name', { length: { is: 6 } });
PersistenceRecord.validates('age', { numericality: { lessThan: 10 } });

class PersistenceOneRecord extends ActiveRecord$Base<PersistenceOneRecordParams> {
  public id: PersistenceOneRecordParams['id'];
  public parentId: PersistenceOneRecordParams['parentId'];
  public oneName: PersistenceOneRecordParams['oneName'];
  public oneAge: PersistenceOneRecordParams['oneAge'];

  protected fetchAll(): Promise<PersistenceOneRecordParams[]> {
    return Promise.resolve([]);
  }

  static translate(key: string, opts?: any): string {
    return key;
  }

  get uniqueKey(): string {
    return 'PersistenceOneRecord';
  }
}

PersistenceOneRecord.validates('oneName', { length: { is: 10 } });
PersistenceOneRecord.validates('oneAge', {
  numericality: { lessThan: 10 },
  allow_undefined: true,
});

PersistenceRecord.hasOne<PersistenceOneRecord>('one', {
  klass: PersistenceOneRecord,
  foreignKey: 'parentId',
  validate: true,
});

describe('ActiveRecord$Base (ActiveRecord$Persistence / hasOne)', () => {
  beforeEach(() => {
    PersistenceRecord.resetRecordCache();
    PersistenceOneRecord.resetRecordCache();
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('#save', () => {
    describe('when success save (default: autosave === true)', () => {
      it('should correctly', async () => {
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        expect(await record.buildOne({ id: 5, oneName: 'one_name_5' })).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: {},
          id: 5,
          oneName: 'one_name_5',
          parentId: 1,
        });
        expect(await record.one()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: {},
          id: 5,
          oneName: 'one_name_5',
          parentId: 1,
        });
        expect(await record.save()).toEqual(true);
        expect(await record.one()).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          errors: { oneAge: [], oneName: [] },
          id: 5,
          oneName: 'one_name_5',
          parentId: 1,
        });
      });
    });

    describe('when failed save', () => {
      it('should correctly', async () => {
        const err = new Error(
          "'rue.records.PersistenceOneRecord.oneName' is not equal length ('10' characters)."
        );
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        await record.buildOne();
        expect(await record.save()).toEqual(false);
        expect(await record.one()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: { oneAge: [], oneName: [err] },
          parentId: 1,
        });
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
        public one: t.Record$HasOne<PersistenceOneRecord>;

        protected fetchAll(): Promise<AutosaveFalseRecordParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
            { id: 3, name: 'name_3', age: 3 },
            { id: 4, name: 'name_4', age: 4 },
          ]);
        }

        buildOne(params?: Partial<AutosaveFalseOneRecordParams>): Promise<AutosaveFalseOneRecord> {
          return this.buildHasOneRecord<AutosaveFalseOneRecord>('one', params);
        }

        get uniqueKey(): string {
          return 'AutosaveFalseRecord';
        }
      }

      AutosaveFalseRecord.validates('name', { length: { is: 6 } });
      AutosaveFalseRecord.validates('age', { numericality: { lessThan: 10 } });

      type AutosaveFalseOneRecordParams = {
        id: t.Record$PrimaryKey;
        parentId: t.Record$ForeignKey;
        oneName: string;
        oneAge: number;
      };

      class AutosaveFalseOneRecord extends ActiveRecord$Base<AutosaveFalseOneRecordParams> {
        public id: AutosaveFalseOneRecordParams['id'];
        public parentId: AutosaveFalseOneRecordParams['parentId'];
        public oneName: AutosaveFalseOneRecordParams['oneName'];
        public oneAge: AutosaveFalseOneRecordParams['oneAge'];

        protected fetchAll(): Promise<AutosaveFalseOneRecordParams[]> {
          return Promise.resolve([]);
        }

        static translate(key: string, opts?: any): string {
          return key;
        }

        get uniqueKey(): string {
          return 'AutosaveFalseOneRecord';
        }
      }

      AutosaveFalseOneRecord.validates('oneName', { length: { is: 10 } });
      AutosaveFalseOneRecord.validates('oneAge', {
        numericality: { lessThan: 10 },
        allow_undefined: true,
      });

      AutosaveFalseRecord.hasOne<AutosaveFalseOneRecord>('one', {
        klass: AutosaveFalseOneRecord,
        foreignKey: 'parentId',
        validate: true,
        autosave: false,
      });

      afterEach(() => {
        AutosaveFalseRecord.resetRecordCache();
        AutosaveFalseOneRecord.resetRecordCache();
      });

      it('associated records save is skipped (should return true)', async () => {
        const record = (await AutosaveFalseRecord.first<AutosaveFalseRecord>()) as AutosaveFalseRecord;
        expect(await record.buildOne({ id: 5, oneName: 'one_name_5' })).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: {},
          id: 5,
          oneName: 'one_name_5',
          parentId: 1,
        });
        expect(await record.one()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: {},
          id: 5,
          oneName: 'one_name_5',
          parentId: 1,
        });
        expect(await record.save()).toEqual(true);
        expect(await record.one()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: { oneAge: [], oneName: [] },
          id: 5,
          oneName: 'one_name_5',
          parentId: 1,
        });
      });

      it('associated records save is skipped (should return false / validation error)', async () => {
        const errForRecord = new Error('AutosaveFalseOneRecord is invalid.');
        const errForOneName = new Error(
          "'rue.records.AutosaveFalseOneRecord.oneName' is not equal length ('10' characters)."
        );
        const errForOneAge = new Error(
          "'rue.records.AutosaveFalseOneRecord.oneAge' is not less than '10'."
        );
        const record = (await AutosaveFalseRecord.first<AutosaveFalseRecord>()) as AutosaveFalseRecord;
        await record.buildOne({
          id: 5,
          oneName: 'invalid_name_5',
          oneAge: 100,
        });
        expect(await record.save()).toEqual(false);
        expect(record.errors['hasOne']['one']).toEqual([errForRecord]);
        expect(await record.one()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: { oneAge: [errForOneAge], oneName: [errForOneName] },
          id: 5,
          oneAge: 100,
          oneName: 'invalid_name_5',
          parentId: 1,
        });
      });
    });
  });

  describe('#saveOrThrow', () => {
    describe('when success save', () => {
      it('should correctly', async () => {
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        await record.buildOne({ id: 5, oneName: 'one_name_5' });
        expect(await record.save()).toEqual(true);
      });
    });

    describe('when throw error', () => {
      it('should correctly', async () => {
        const record = (await PersistenceRecord.first<PersistenceRecord>()) as PersistenceRecord;
        const errForOneName = new Error(
          "'rue.records.PersistenceOneRecord.oneName' is not equal length ('10' characters)."
        );
        await record.buildOne();
        try {
          await record.saveOrThrow();
        } catch (err) {
          expect(err.toString()).toEqual(`Error: PersistenceOneRecord {
  "_associationCache": {},
  "_destroyed": false,
  "_newRecord": true,
  "errors": {
    "oneName": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY_IS_NOT_EQUAL_LENGTH"
      }
    ],
    "oneAge": []
  },
  "parentId": 1
} is invalid.`);
        }
        expect(await record.one()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: { oneAge: [], oneName: [errForOneName] },
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
        public dependentUndefined: t.Record$HasOne<DependentUndefinnedOneRecord>;

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

      class DependentUndefinnedOneRecord extends ActiveRecord$Base<PersistenceOneRecordParams> {
        public id: PersistenceOneRecordParams['id'];
        public parentId: PersistenceOneRecordParams['parentId'];
        public oneName: PersistenceOneRecordParams['oneName'];
        public oneAge: PersistenceOneRecordParams['oneAge'];

        protected fetchAll(): Promise<PersistenceOneRecordParams[]> {
          return Promise.resolve([{ id: 1, parentId: 1, oneName: 'one_name_1', oneAge: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentUndefinnedOneRecord';
        }
      }

      DependentUndefinnedRecord.hasOne('dependentUndefined', {
        klass: DependentUndefinnedOneRecord,
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
        public dependentNullify: t.Record$HasOne<DependentNullifyOneRecord>;

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

      class DependentNullifyOneRecord extends ActiveRecord$Base<PersistenceOneRecordParams> {
        public id: PersistenceOneRecordParams['id'];
        public parentId: PersistenceOneRecordParams['parentId'];
        public oneName: PersistenceOneRecordParams['oneName'];
        public oneAge: PersistenceOneRecordParams['oneAge'];

        protected fetchAll(): Promise<PersistenceOneRecordParams[]> {
          return Promise.resolve([{ id: 1, parentId: 1, oneName: 'one_name_1', oneAge: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentNullifyOneRecord';
        }
      }

      DependentNullifyRecord.hasOne('dependentNullify', {
        klass: DependentNullifyOneRecord,
        foreignKey: 'parentId',
        dependent: 'nullify',
      });

      it('should correctly', async () => {
        const record = (await DependentNullifyRecord.first<DependentNullifyRecord>()) as DependentNullifyRecord;
        await record.destroy();
        expect(await record.dependentNullify()).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          errors: {},
          id: 1,
          oneAge: 1,
          oneName: 'one_name_1',
          parentId: undefined,
        });
        expect(await DependentNullifyOneRecord.all()).toEqual([
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
            oneAge: 1,
            oneName: 'one_name_1',
          },
        ]);
      });
    });

    describe("when 'dependent === destroy'", () => {
      class DependentDestroyRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentDestroy: t.Record$HasOne<DependentDestroyOneRecord>;

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

      class DependentDestroyOneRecord extends ActiveRecord$Base<PersistenceOneRecordParams> {
        public id: PersistenceOneRecordParams['id'];
        public parentId: PersistenceOneRecordParams['parentId'];
        public oneName: PersistenceOneRecordParams['oneName'];
        public oneAge: PersistenceOneRecordParams['oneAge'];

        protected fetchAll(): Promise<PersistenceOneRecordParams[]> {
          return Promise.resolve([{ id: 1, parentId: 1, oneName: 'one_name_1', oneAge: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentDestroyOneRecord';
        }
      }

      DependentDestroyRecord.hasOne('dependentDestroy', {
        klass: DependentDestroyOneRecord,
        foreignKey: 'parentId',
        dependent: 'destroy',
      });

      it('should correctly', async () => {
        const record = (await DependentDestroyRecord.first<DependentDestroyRecord>()) as DependentDestroyRecord;
        const destroyedRecord = await record.destroy();
        expect(destroyedRecord['_destroyed']).toEqual(true);
        expect(await record.dependentDestroy()).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: true,
          _newRecord: false,
          errors: {},
          id: 1,
          oneAge: 1,
          oneName: 'one_name_1',
          parentId: 1,
        });
        expect(await DependentDestroyOneRecord.all()).toEqual([]);
      });
    });

    describe("when 'dependent === delete'", () => {
      class DependentDeleteRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentDeleteAll: t.Record$HasOne<DependentDeleteOneRecord>;

        protected fetchAll(): Promise<PersistenceRecordParams[]> {
          return Promise.resolve([
            { id: 1, name: 'name_1', age: 1 },
            { id: 2, name: 'name_2', age: 2 },
            { id: 3, name: 'name_3', age: 3 },
            { id: 4, name: 'name_4', age: 4 },
          ]);
        }

        get uniqueKey(): string {
          return 'DependentDeleteRecord';
        }
      }

      class DependentDeleteOneRecord extends ActiveRecord$Base<PersistenceOneRecordParams> {
        public id: PersistenceOneRecordParams['id'];
        public parentId: PersistenceOneRecordParams['parentId'];
        public oneName: PersistenceOneRecordParams['oneName'];
        public oneAge: PersistenceOneRecordParams['oneAge'];

        protected fetchAll(): Promise<PersistenceOneRecordParams[]> {
          return Promise.resolve([{ id: 1, parentId: 1, oneName: 'one_name_1', oneAge: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentDeleteOneRecord';
        }
      }

      DependentDeleteRecord.hasOne('dependentDeleteAll', {
        klass: DependentDeleteOneRecord,
        foreignKey: 'parentId',
        dependent: 'delete',
      });

      it('should correctly', async () => {
        const record = (await DependentDeleteRecord.first<DependentDeleteRecord>()) as DependentDeleteRecord;
        const destroyedRecord = await record.destroy();
        expect(destroyedRecord['_destroyed']).toEqual(true);
        expect(await record.dependentDeleteAll()).toEqual(undefined);
        expect(await DependentDeleteOneRecord.all()).toEqual([]);
      });
    });

    describe("when 'dependent === restrictWithException'", () => {
      class DependentRestrictWithExceptionRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentDeleteAll: t.Record$HasOne<DependentRestrictWithExceptionOneRecord>;

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

      class DependentRestrictWithExceptionOneRecord extends ActiveRecord$Base<PersistenceOneRecordParams> {
        public id: PersistenceOneRecordParams['id'];
        public parentId: PersistenceOneRecordParams['parentId'];
        public oneName: PersistenceOneRecordParams['oneName'];
        public oneAge: PersistenceOneRecordParams['oneAge'];

        protected fetchAll(): Promise<PersistenceOneRecordParams[]> {
          return Promise.resolve([{ id: 1, parentId: 1, oneName: 'one_name_1', oneAge: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentRestrictWithExceptionOneRecord';
        }
      }

      DependentRestrictWithExceptionRecord.hasOne('dependentDeleteAll', {
        klass: DependentRestrictWithExceptionOneRecord,
        foreignKey: 'parentId',
        dependent: 'restrictWithException',
      });

      it('should correctly', async () => {
        const record = (await DependentRestrictWithExceptionRecord.first<DependentRestrictWithExceptionRecord>()) as DependentRestrictWithExceptionRecord;
        try {
          await record.destroy();
        } catch (err) {
          expect(err.toString()).toEqual(
            "Error: Cannot delete record because of dependent 'DependentRestrictWithExceptionOneRecord' records"
          );
        }
      });
    });

    describe("when 'dependent === restrictWithError'", () => {
      class DependentRestrictWithErrorRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentDeleteAll: t.Record$HasOne<DependentRestrictWithErrorOneRecord>;

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

      class DependentRestrictWithErrorOneRecord extends ActiveRecord$Base<PersistenceOneRecordParams> {
        public id: PersistenceOneRecordParams['id'];
        public parentId: PersistenceOneRecordParams['parentId'];
        public oneName: PersistenceOneRecordParams['oneName'];
        public oneAge: PersistenceOneRecordParams['oneAge'];

        protected fetchAll(): Promise<PersistenceOneRecordParams[]> {
          return Promise.resolve([{ id: 1, parentId: 1, oneName: 'one_name_1', oneAge: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentRestrictWithErrorOneRecord';
        }
      }

      DependentRestrictWithErrorRecord.hasOne('dependentDeleteAll', {
        klass: DependentRestrictWithErrorOneRecord,
        foreignKey: 'parentId',
        dependent: 'restrictWithError',
      });

      it('should correctly', async () => {
        const err = new Error(
          "Cannot delete record because of dependent 'DependentRestrictWithErrorOneRecord' records"
        );
        const record = (await DependentRestrictWithErrorRecord.first<DependentRestrictWithErrorRecord>()) as DependentRestrictWithErrorRecord;
        const destroyedRecord = await record.destroy();
        expect(destroyedRecord).toEqual(false);
        expect(record.errors).toEqual({ hasOne: { dependentDeleteAll: [err] } });
      });
    });
  });
});
