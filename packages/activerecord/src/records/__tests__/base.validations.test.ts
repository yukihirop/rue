import { ActiveRecord$Base } from '@/records';

// third party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

type ValidationsRecordParams = {
  id: t.Record$PrimaryKey;
  name: string;
  age: number;
};

class ValidationsRecord extends ActiveRecord$Base<ValidationsRecordParams> {
  public id: ValidationsRecordParams['id'];
  public name: ValidationsRecordParams['name'];
  public age: ValidationsRecordParams['age'];
  public children: t.Record$HasMany<ValidationsChildRecord>;

  protected fetchAll(): Promise<ValidationsRecordParams[]> {
    return Promise.resolve([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
      { id: 4, name: 'name_4', age: 4 },
    ]);
  }
}

ValidationsRecord.validates('name', { length: { is: 6 } });
ValidationsRecord.validates('age', { numericality: { lessThan: 10 } });

type ValidationsChildRecordParams = {
  id: t.Record$PrimaryKey;
  parentId: t.Record$ForeignKey;
  childName: string;
  childAge: number;
};

class ValidationsChildRecord extends ActiveRecord$Base<ValidationsChildRecordParams> {
  public id: ValidationsChildRecordParams['id'];
  public parentId: ValidationsChildRecordParams['parentId'];
  public childName: ValidationsChildRecordParams['childName'];
  public childAge: ValidationsChildRecordParams['childAge'];

  protected fetchAll(): Promise<ValidationsChildRecordParams[]> {
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

ValidationsChildRecord.validates('childName', { length: { is: 12 } });
ValidationsChildRecord.validates('childAge', {
  numericality: { lessThan: 10 },
  allow_undefined: true,
});

ValidationsRecord.hasMany<ValidationsChildRecord>('children', {
  klass: ValidationsChildRecord,
  foreignKey: 'parentId',
  validate: true,
});

describe('ActiveRecord$Base (ActiveRecord$Validations)', () => {
  beforeEach(() => {
    ValidationsRecord.resetRecordCache();
    ValidationsChildRecord.resetRecordCache();
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('#save', () => {
    describe('when success save', () => {
      it('should correctly', async () => {
        const record = (await ValidationsRecord.first<ValidationsRecord>()) as ValidationsRecord;
        await record
          .children()
          .build<ValidationsChildRecordParams>({ id: 5, childName: 'child_name_5' });
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
        const record = (await ValidationsRecord.first<ValidationsRecord>()) as ValidationsRecord;
        const err = new Error(
          "'rue.records.ValidationsChildRecord.childName' is not equal length ('12' characters)."
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
        const record = (await ValidationsRecord.first<ValidationsRecord>()) as ValidationsRecord;
        await record
          .children()
          .build<ValidationsChildRecordParams>({ id: 5, childName: 'child_name_5' });
        expect(await record.save()).toEqual(true);
      });
    });

    describe('when throw error', () => {
      it('should correctly', async () => {
        const record = (await ValidationsRecord.first<ValidationsRecord>()) as ValidationsRecord;
        const err = new Error(
          "'rue.records.ValidationsChildRecord.childName' is not equal length ('12' characters)."
        );
        await record.children().build<ValidationsChildRecordParams>();
        try {
          await record.saveOrThrow();
        } catch (err) {
          expect(err.toString()).toEqual(`Error: ValidationsChildRecord {
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
});
