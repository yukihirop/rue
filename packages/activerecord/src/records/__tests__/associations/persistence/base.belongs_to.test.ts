import { ActiveRecord$Base } from '@/records';

// third party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

type PersistenceBelongsToRecordParams = {
  id: t.Record$PrimaryKey;
  belongsToName: string;
  belongsToAge: number;
};

type PersistenceRecordParams = {
  id: t.Record$PrimaryKey;
  parentId: t.Record$ForeignKey;
  name: string;
  age: number;
};

class PersistenceBelongsToRecord extends ActiveRecord$Base<PersistenceBelongsToRecordParams> {
  public id: PersistenceBelongsToRecordParams['id'];
  public belongsToName: PersistenceBelongsToRecordParams['belongsToName'];
  public belongsToAge: PersistenceBelongsToRecordParams['belongsToAge'];

  protected fetchAll(): Promise<PersistenceBelongsToRecordParams[]> {
    return Promise.resolve([]);
  }

  static translate(key: string, opts?: any): string {
    return key;
  }

  get uniqueKey(): string {
    return 'PersistenceBelongsToRecord';
  }
}

PersistenceBelongsToRecord.validates('belongsToName', { length: { is: 17 } });
PersistenceBelongsToRecord.validates('belongsToAge', {
  numericality: { lessThan: 10 },
  allow_undefined: true,
});

class PersistenceRecord extends ActiveRecord$Base<PersistenceRecordParams> {
  public id: PersistenceRecordParams['id'];
  public parentId: PersistenceRecordParams['parentId'];
  public name: PersistenceRecordParams['name'];
  public age: PersistenceRecordParams['age'];
  public belongsTo: t.Record$BelongsTo<PersistenceBelongsToRecord>;

  protected fetchAll(): Promise<PersistenceRecordParams[]> {
    return Promise.resolve([]);
  }

  static translate(key: string, opts?: any): string {
    return key;
  }

  buildBelongsTo(
    params?: Partial<PersistenceBelongsToRecordParams>
  ): Promise<PersistenceBelongsToRecord> {
    return this.buildBelongsToRecord<PersistenceBelongsToRecord>('belongsTo', params);
  }

  get uniqueKey(): string {
    return 'PersistenceRecord';
  }
}

PersistenceRecord.validates('name', { length: { is: 6 } });
PersistenceRecord.validates('age', { numericality: { lessThan: 10 } });

PersistenceRecord.belongsTo<PersistenceBelongsToRecord>('belongsTo', {
  klass: PersistenceBelongsToRecord,
  foreignKey: 'parentId',
  validate: true,
});

describe('ActiveRecord$Base (ActiveRecord$Persistence / belongsTo)', () => {
  beforeEach(() => {
    PersistenceRecord.resetRecordCache();
    PersistenceBelongsToRecord.resetRecordCache();
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('#save', () => {
    describe('when success save (default: autosave === true)', () => {
      it('should correctly', async () => {
        const record = new PersistenceRecord({ id: 1, name: 'name_1', age: 1 });
        expect(await record.buildBelongsTo({ id: 1, belongsToName: 'belongs_to_name_1' })).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          belongsToName: 'belongs_to_name_1',
          errors: {},
          id: 1,
          parentId: 1,
        });
        expect(await record.belongsTo()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          belongsToName: 'belongs_to_name_1',
          errors: {},
          id: 1,
          parentId: 1,
        });
        expect(await record.save()).toEqual(true);
        expect(await record.belongsTo()).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          belongsToName: 'belongs_to_name_1',
          errors: { belongsToAge: [], belongsToName: [] },
          id: 1,
          parentId: 1,
        });
      });
    });

    describe('when failed save', () => {
      it('should correctly', async () => {
        const err = new Error(
          "'rue.records.PersistenceBelongsToRecord.belongsToName' is not equal length ('17' characters)."
        );
        const record = (await PersistenceRecord.create<PersistenceRecord, PersistenceRecordParams>({
          id: 1,
          name: 'name_1',
          age: 1,
        })) as PersistenceRecord;
        expect(await record.buildBelongsTo({ id: 1 })).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: {},
          id: 1,
          parentId: 1,
        });
        expect(await record.save()).toEqual(false);
        expect(await record.belongsTo()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: { belongsToAge: [], belongsToName: [err] },
          id: 1,
          parentId: 1,
        });
      });
    });

    describe('when specify autosave === false', () => {
      type AutosaveFalseRecordParams = {
        id: t.Record$PrimaryKey;
        parentId: t.Record$ForeignKey;
        name: string;
        age: number;
      };

      class AutosaveFalseRecord extends ActiveRecord$Base<AutosaveFalseRecordParams> {
        public id: AutosaveFalseRecordParams['id'];
        public parentId: AutosaveFalseRecordParams['parentId'];
        public name: AutosaveFalseRecordParams['name'];
        public age: AutosaveFalseRecordParams['age'];
        public belongsTo: t.Record$BelongsTo<PersistenceBelongsToRecord>;

        protected fetchAll(): Promise<AutosaveFalseRecordParams[]> {
          return Promise.resolve([{ id: 1, parentId: 1, name: 'name_1', age: 1 }]);
        }

        buildBelongsTo(
          params?: Partial<AutosaveFalseBelongsToRecordParams>
        ): Promise<AutosaveFalseBelongsToRecord> {
          return this.buildBelongsToRecord<AutosaveFalseBelongsToRecord>('belongsTo', params);
        }

        get uniqueKey(): string {
          return 'AutosaveFalseRecord';
        }
      }

      AutosaveFalseRecord.validates('name', { length: { is: 6 } });
      AutosaveFalseRecord.validates('age', { numericality: { lessThan: 10 } });

      type AutosaveFalseBelongsToRecordParams = {
        id: t.Record$PrimaryKey;
        parentId: t.Record$ForeignKey;
        belongsToName: string;
        belongsToAge: number;
      };

      class AutosaveFalseBelongsToRecord extends ActiveRecord$Base<AutosaveFalseBelongsToRecordParams> {
        public id: AutosaveFalseBelongsToRecordParams['id'];
        public parentId: AutosaveFalseBelongsToRecordParams['parentId'];
        public belongsToName: AutosaveFalseBelongsToRecordParams['belongsToName'];
        public belongsToAge: AutosaveFalseBelongsToRecordParams['belongsToAge'];

        protected fetchAll(): Promise<AutosaveFalseBelongsToRecordParams[]> {
          return Promise.resolve([]);
        }

        static translate(key: string, opts?: any): string {
          return key;
        }

        get uniqueKey(): string {
          return 'AutosaveFalseBelongsToRecord';
        }
      }

      AutosaveFalseBelongsToRecord.validates('belongsToName', { length: { is: 17 } });
      AutosaveFalseBelongsToRecord.validates('belongsToAge', {
        numericality: { lessThan: 10 },
        allow_undefined: true,
      });

      AutosaveFalseRecord.belongsTo<AutosaveFalseBelongsToRecord>('belongsTo', {
        klass: AutosaveFalseBelongsToRecord,
        foreignKey: 'parentId',
        validate: true,
        autosave: false,
      });

      afterEach(() => {
        AutosaveFalseRecord.resetRecordCache();
        AutosaveFalseBelongsToRecord.resetRecordCache();
      });

      it('associated records save is skipped (should return true)', async () => {
        const record = (await AutosaveFalseRecord.first<AutosaveFalseRecord>()) as AutosaveFalseRecord;
        const belongsToRecord = await record.buildBelongsTo({
          id: 1,
          belongsToName: 'belongs_to_name_1',
        });
        expect(belongsToRecord).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          belongsToName: 'belongs_to_name_1',
          errors: {},
          id: 1,
          parentId: 1,
        });
        expect(await record.belongsTo()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          belongsToName: 'belongs_to_name_1',
          errors: {},
          id: 1,
          parentId: 1,
        });
        belongsToRecord.belongsToName = 'belongs_to_name_2';
        expect(await record.save()).toEqual(true);
        expect(await record.belongsTo()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          belongsToName: 'belongs_to_name_2',
          errors: { belongsToAge: [], belongsToName: [] },
          id: 1,
          parentId: 1,
        });
      });

      it('associated records save is skipped (should return false / validation error)', async () => {
        const errForRecord = new Error('AutosaveFalseBelongsToRecord is invalid.');
        const errForBelongsToName = new Error(
          "'rue.records.AutosaveFalseBelongsToRecord.belongsToName' is not equal length ('17' characters)."
        );
        const errForBelongsToAge = new Error(
          "'rue.records.AutosaveFalseBelongsToRecord.belongsToAge' is not less than '10'."
        );
        const record = (await AutosaveFalseRecord.first<AutosaveFalseRecord>()) as AutosaveFalseRecord;
        await record.buildBelongsTo({
          id: 1,
          belongsToName: 'invalid_name_1',
          belongsToAge: 100,
        });
        expect(await record.save()).toEqual(false);
        expect(record.errors['belongsTo']['belongsTo']).toEqual([errForRecord]);
        expect(await record.belongsTo()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          belongsToAge: 100,
          belongsToName: 'invalid_name_1',
          errors: { belongsToAge: [errForBelongsToAge], belongsToName: [errForBelongsToName] },
          id: 1,
          parentId: 1,
        });
      });
    });
  });

  describe('#saveOrThrow', () => {
    describe('when success save', () => {
      it('should correctly', async () => {
        const record = new PersistenceRecord({ id: 1, name: 'name_1', age: 1 });
        expect(await record.buildBelongsTo({ id: 1, belongsToName: 'belongs_to_name_1' })).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          belongsToName: 'belongs_to_name_1',
          errors: {},
          id: 1,
          parentId: 1,
        });
        expect(await record.saveOrThrow()).toEqual(true);
        expect(await record.belongsTo()).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          belongsToName: 'belongs_to_name_1',
          errors: { belongsToAge: [], belongsToName: [] },
          id: 1,
          parentId: 1,
        });
      });
    });

    describe('when throw error in belongsTo record', () => {
      it('should correctly', async () => {
        const record = new PersistenceRecord({ id: 1, name: 'name_1', age: 1 });
        const errForBelongsToName = new Error(
          "'rue.records.PersistenceBelongsToRecord.belongsToName' is not equal length ('17' characters)."
        );
        expect(await record.buildBelongsTo()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: {},
          parentId: 1,
        });
        try {
          await record.saveOrThrow();
        } catch (err) {
          expect(err.toString()).toEqual(`Error: PersistenceBelongsToRecord {
  "_associationCache": {},
  "_destroyed": false,
  "_newRecord": true,
  "errors": {
    "belongsToName": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY_IS_NOT_EQUAL_LENGTH"
      }
    ],
    "belongsToAge": []
  },
  "parentId": 1
} is invalid.`);
        }
        expect(await record.belongsTo()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: { belongsToAge: [], belongsToName: [errForBelongsToName] },
          parentId: 1,
        });
      });
    });

    describe('when throw error in record', () => {
      it('should correctly', async () => {
        const record = new PersistenceRecord({ id: 1, name: 'invalid_name_1', age: 100 });
        expect(await record.buildBelongsTo()).toEqual({
          __rue_record_id__: undefined,
          _associationCache: {},
          _destroyed: false,
          _newRecord: true,
          errors: {},
          parentId: 1,
        });
        try {
          await record.saveOrThrow();
        } catch (err) {
          expect(err.toString()).toEqual(`Error: PersistenceRecord {
  "_associationCache": {
    "belongsTo": {
      "associationHolder": {
        "isHolder": true,
        "scope": [],
        "_defaultScopeParams": {
          "where": {},
          "order": {},
          "group": []
        },
        "scopeParams": {
          "where": {},
          "order": {},
          "group": []
        },
        "groupedRecords": {},
        "errors": [],
        "associationData": {
          "validate": true,
          "foreignKeyData": {
            "parentId": 1
          }
        },
        "foreignKeyData": {
          "parentId": 1
        }
      },
      "associationScope": [
        {
          "errors": {},
          "parentId": 1,
          "_newRecord": true,
          "_destroyed": false,
          "_associationCache": {}
        }
      ]
    }
  },
  "_destroyed": false,
  "_newRecord": true,
  "age": 100,
  "errors": {
    "name": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY_IS_NOT_EQUAL_LENGTH"
      }
    ],
    "age": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY_IS_NOT_LESS_THAN_NUMERIC"
      }
    ]
  },
  "id": 1,
  "name": "invalid_name_1"
} is invalid.`);
        }
        const errForName = new Error(
          "'rue.records.PersistenceRecord.name' is not equal length ('6' characters)."
        );
        const errForAge = new Error("'rue.records.PersistenceRecord.age' is not less than '10'.");
        expect(record.errors).toEqual({ age: [errForAge], name: [errForName] });
      });
    });
  });

  describe('#destroy', () => {
    describe("when 'dependent === undefined' (default)", () => {
      class DependentUndefinnedRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public parentId: PersistenceRecordParams['parentId'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentUndefined: t.Record$BelongsTo<DependentUndefinnedBelongsToRecord>;

        protected fetchAll(): Promise<PersistenceRecordParams[]> {
          return Promise.resolve([{ id: 1, parentId: 1, name: 'name_1', age: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentUndefinnedRecord';
        }
      }

      class DependentUndefinnedBelongsToRecord extends ActiveRecord$Base<PersistenceBelongsToRecordParams> {
        public id: PersistenceBelongsToRecordParams['id'];
        public belongsToName: PersistenceBelongsToRecordParams['belongsToName'];
        public belongsToAge: PersistenceBelongsToRecordParams['belongsToAge'];

        protected fetchAll(): Promise<PersistenceBelongsToRecordParams[]> {
          return Promise.resolve([{ id: 1, belongsToName: 'belongsTo_name_1', belongsToAge: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentUndefinnedBelongsToRecord';
        }
      }

      DependentUndefinnedRecord.belongsTo('dependentUndefined', {
        klass: DependentUndefinnedBelongsToRecord,
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

    describe("when 'dependent === destroy'", () => {
      class DependentDestroyRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public parentId: PersistenceRecordParams['parentId'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentDestroy: t.Record$BelongsTo<DependentDestroyBelongsToRecord>;

        protected fetchAll(): Promise<PersistenceRecordParams[]> {
          return Promise.resolve([{ id: 1, parentId: 1, name: 'name_1', age: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentDestroyRecord';
        }
      }

      class DependentDestroyBelongsToRecord extends ActiveRecord$Base<PersistenceBelongsToRecordParams> {
        public id: PersistenceBelongsToRecordParams['id'];
        public belongsToName: PersistenceBelongsToRecordParams['belongsToName'];
        public belongsToAge: PersistenceBelongsToRecordParams['belongsToAge'];

        protected fetchAll(): Promise<PersistenceBelongsToRecordParams[]> {
          return Promise.resolve([{ id: 1, belongsToName: 'belongs_to_name_1', belongsToAge: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentDestroyBelongsToRecord';
        }
      }

      DependentDestroyRecord.belongsTo('dependentDestroy', {
        klass: DependentDestroyBelongsToRecord,
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
          belongsToAge: 1,
          belongsToName: 'belongs_to_name_1',
          errors: {},
          id: 1,
        });
        expect(await DependentDestroyBelongsToRecord.all()).toEqual([]);
      });
    });

    describe("when 'dependent === delete'", () => {
      class DependentDeleteRecord extends ActiveRecord$Base<PersistenceRecordParams> {
        public id: PersistenceRecordParams['id'];
        public parentId: PersistenceRecordParams['parentId'];
        public name: PersistenceRecordParams['name'];
        public age: PersistenceRecordParams['age'];
        public dependentDelete: t.Record$BelongsTo<DependentDeleteBelongsToRecord>;

        protected fetchAll(): Promise<PersistenceRecordParams[]> {
          return Promise.resolve([{ id: 1, parentId: 1, name: 'name_1', age: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentDeleteRecord';
        }
      }

      class DependentDeleteBelongsToRecord extends ActiveRecord$Base<PersistenceBelongsToRecordParams> {
        public id: PersistenceBelongsToRecordParams['id'];
        public belongsToName: PersistenceBelongsToRecordParams['belongsToName'];
        public belongsToAge: PersistenceBelongsToRecordParams['belongsToAge'];

        protected fetchAll(): Promise<PersistenceBelongsToRecordParams[]> {
          return Promise.resolve([{ id: 1, belongsToName: 'belongs_to_name_1', belongsToAge: 1 }]);
        }

        get uniqueKey(): string {
          return 'DependentDeleteBelongsToRecord';
        }
      }

      DependentDeleteRecord.belongsTo('dependentDelete', {
        klass: DependentDeleteBelongsToRecord,
        foreignKey: 'parentId',
        dependent: 'delete',
      });

      it('should correctly', async () => {
        const record = (await DependentDeleteRecord.first<DependentDeleteRecord>()) as DependentDeleteRecord;
        const destroyedRecord = await record.destroy();
        expect(destroyedRecord['_destroyed']).toEqual(true);
        expect(await record.dependentDelete()).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: true,
          _newRecord: false,
          belongsToAge: 1,
          belongsToName: 'belongs_to_name_1',
          errors: {},
          id: 1,
        });
        expect(await DependentDeleteBelongsToRecord.all()).toEqual([]);
      });
    });
  });
});
