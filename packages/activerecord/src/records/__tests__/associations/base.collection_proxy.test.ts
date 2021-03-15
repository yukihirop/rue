import { ActiveRecord$Base } from '@/records';

// thrid party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

type CollectionProxyRecordParams = {
  id: t.Record$PrimaryKey;
  name: string;
  age: number;
};

type CollectionProxyChildRecordParams = {
  id: t.Record$PrimaryKey;
  parentId: t.Record$ForeignKey;
  childName: string;
  childAge: number;
};

class CollectionProxyRecord extends ActiveRecord$Base<CollectionProxyRecordParams> {
  public id: CollectionProxyRecordParams['id'];
  public name: CollectionProxyRecordParams['name'];
  public age: CollectionProxyRecordParams['age'];
  public children: t.Record$HasMany<CollectionProxyChildRecord>;

  protected fetchAll(): Promise<CollectionProxyRecordParams[]> {
    return Promise.resolve([
      { id: 1, name: 'name_1', age: 1 },
      { id: 2, name: 'name_2', age: 2 },
      { id: 3, name: 'name_3', age: 3 },
      { id: 4, name: 'name_4', age: 4 },
    ]);
  }
}

class CollectionProxyChildRecord extends ActiveRecord$Base<CollectionProxyChildRecordParams> {
  public id: CollectionProxyChildRecordParams['id'];
  public parentId: CollectionProxyChildRecordParams['parentId'];
  public childName: CollectionProxyChildRecordParams['childName'];
  public childAge: CollectionProxyChildRecordParams['childAge'];

  protected fetchAll(): Promise<CollectionProxyChildRecordParams[]> {
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

CollectionProxyRecord.hasMany('children', CollectionProxyChildRecord, 'parentId');

CollectionProxyChildRecord.validates('childName', { length: { is: 12 }, allow_undefined: true });
CollectionProxyChildRecord.validates('childAge', {
  numericality: { lessThan: 10 },
  allow_undefined: true,
});

describe('ActiveRecord$Associations (delegate to ActiveRecord$Associations$CollectionProxy)', () => {
  let record: CollectionProxyRecord;

  beforeEach(async () => {
    MockDate.set('2021-03-05T23:03:21+09:00');
    record = (await CollectionProxyRecord.first()) as CollectionProxyRecord;
  });

  afterEach(() => {
    CollectionProxyChildRecord.resetRecordCache();
    MockDate.reset();
  });

  describe('#scope', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record.children().scope();
        expect(result).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
            _destroyed: false,
            _newRecord: false,
            childAge: 3,
            childName: 'child_name_3',
            errors: { childAge: [], childName: [] },
            id: 3,
            parentId: 1,
          },
        ]);
      });
    });
  });

  describe('#pluck', () => {
    describe("when don't specify args", () => {
      it('should correctly', async () => {
        const result = await record.children().pluck();
        expect(result).toEqual([
          [1, 1, 'child_name_1', 1],
          [2, 1, 'child_name_2', 2],
          [3, 1, 'child_name_3', 3],
        ]);
      });
    });

    describe('when specify args', () => {
      it('should correctly', async () => {
        const result = await record.children().pluck('id', 'childName');
        expect(result).toEqual([
          [1, 'child_name_1'],
          [2, 'child_name_2'],
          [3, 'child_name_3'],
        ]);
      });
    });
  });

  describe('#isAny (inherited)', () => {
    describe('when return true', () => {
      it('should correctly', async () => {
        const result = await record.children().isAny();
        expect(result).toEqual(true);
      });
    });

    describe('when return false', () => {
      it('should correctly', async () => {
        const result = await record.children().limit(0).isAny();
        expect(result).toEqual(false);
      });
    });
  });

  describe('#build (inherited)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .build<CollectionProxyChildRecordParams>({ childName: 'child_name_5' });
        expect(result).toEqual({
          __rue_record_id__: undefined,
          _destroyed: false,
          _newRecord: true,
          childName: 'child_name_5',
          errors: {},
          parentId: 1,
        });
      });
    });

    describe("when specify 'array of params'", () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .build<CollectionProxyChildRecordParams>([
            { childName: 'child_name_5' },
            { childName: 'child_name_6' },
          ]);
        expect(result).toEqual([
          {
            __rue_record_id__: undefined,
            _destroyed: false,
            _newRecord: true,
            childName: 'child_name_5',
            errors: {},
            parentId: 1,
          },
          {
            __rue_record_id__: undefined,
            _destroyed: false,
            _newRecord: true,
            childName: 'child_name_6',
            errors: {},
            parentId: 1,
          },
        ]);
      });
    });

    describe("when specify 'yielder'", () => {
      it('shoulld correctly', async () => {
        const result = await record.children().build({ childName: 'child_name_5' }, (self) => {
          self.childAge = 5;
        });
        expect(result).toEqual({
          __rue_record_id__: undefined,
          _destroyed: false,
          _newRecord: true,
          childAge: 5,
          childName: 'child_name_5',
          errors: {},
          parentId: 1,
        });
      });
    });
  });

  describe('#count', () => {
    describe('when default', () => {
      it('should correct', async () => {
        await record.children().create({ id: 5, childName: 'child_name_5', childAge: undefined });
        const result = await record.children().count();
        expect(result).toEqual(4);
      });
    });

    describe("when specify 'propName'", () => {
      it('should correctly', async () => {
        await record.children().create({ id: 5, childName: 'child_name_5', childAge: undefined });
        const result = await record.children().count<CollectionProxyChildRecordParams>('childAge');
        expect(result).toEqual(3);
      });
    });

    describe("when specify 'filter'", () => {
      it('should correctly', async () => {
        await record.children().create({ id: 5, childName: 'child_name_5', childAge: undefined });
        const result = await record
          .children()
          .count<CollectionProxyChildRecordParams>(
            undefined,
            (self) => self.childName === 'child_name_5'
          );
        expect(result).toEqual(1);
      });
    });
  });

  describe('#create (inherited)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .create<CollectionProxyChildRecordParams>({ childName: 'child_name_5' });
        expect(result).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 5,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          childName: 'child_name_5',
          errors: { childName: [], childAge: [] },
          parentId: 1,
        });
      });
    });

    describe("when specify 'array of params'", () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .create<CollectionProxyChildRecordParams>([
            { childName: 'child_name_5' },
            { childName: 'child_name_6' },
          ]);
        expect(result).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 5,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            childName: 'child_name_5',
            errors: { childName: [], childAge: [] },
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 6,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            childName: 'child_name_6',
            errors: { childName: [], childAge: [] },
          },
        ]);
      });
    });

    describe("when specify 'yielder'", () => {
      it('shoulld correctly', async () => {
        const result = await record.children().create({ childName: 'child_name_5' }, (self) => {
          self.childAge = 4;
        });
        expect(result).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 5,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          childAge: 4,
          childName: 'child_name_5',
          errors: { childName: [], childAge: [] },
          parentId: 1,
        });
      });
    });
  });

  describe('#createOrThrow (inherited)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record.children().createOrThrow<CollectionProxyChildRecordParams>();
        expect(result).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 5,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          errors: { childName: [], childAge: [] },
          parentId: 1,
        });
      });
    });

    describe("when specify 'params'", () => {
      describe('when valid', () => {
        it('should correctly', async () => {
          const result = await record
            .children()
            .createOrThrow<CollectionProxyChildRecordParams>({ childName: 'child_name_4' });
          expect(result).toEqual({
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 5,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            childName: 'child_name_4',
            errors: { childName: [], childAge: [] },
            parentId: 1,
          });
        });
      });

      describe('when invalid', () => {
        it('should correctly', async () => {
          try {
            await record.children().createOrThrow<CollectionProxyChildRecordParams>({
              childName: 'child_name_10',
              childAge: 10,
            });
          } catch (err) {
            expect(err.toString()).toEqual(`Error: CollectionProxyChildRecord {
  "_destroyed": false,
  "_newRecord": true,
  "childAge": 10,
  "childName": "child_name_10",
  "errors": {
    "childName": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY IS NOT EQUAL LENGTH"
      }
    ],
    "childAge": [
      {
        "_namespace": "@rue/activemodel",
        "_code": "PROPERTY IS NOT LESS THAN NUMERIC"
      }
    ]
  },
  "parentId": 1
} is invalid.`);
          }
        });
      });
    });

    describe("when specify 'array of params'", () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .createOrThrow<CollectionProxyChildRecordParams>([
            { childName: 'child_name_5' },
            { childName: 'child_name_6' },
          ]);
        expect(result).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 5,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            childName: 'child_name_5',
            errors: { childName: [], childAge: [] },
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 6,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            childName: 'child_name_6',
            errors: { childName: [], childAge: [] },
          },
        ]);
      });
    });

    describe("when specify 'yielder'", () => {
      it('shoulld correctly', async () => {
        const result = await record
          .children()
          .createOrThrow({ childName: 'child_name_5' }, (self) => {
            self.childAge = 5;
          });
        expect(result).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 5,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          childAge: 5,
          childName: 'child_name_5',
          errors: { childName: [], childAge: [] },
          parentId: 1,
        });
      });
    });
  });

  describe('#deleteAll (inherited)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record.children().deleteAll();
        expect(result).toEqual(3);
      });
    });
  });

  describe('#destroyAll (inherited)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const records = await record.children().destroyAll();
        expect(records).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: true,
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
            _destroyed: true,
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
            _destroyed: true,
            _newRecord: false,
            childAge: 3,
            childName: 'child_name_3',
            errors: { childAge: [], childName: [] },
            id: 3,
            parentId: 1,
          },
        ]);
      });
    });
  });

  describe('#first (inherited)', () => {
    describe('when default', () => {
      it('should return first record', async () => {
        const result = await record.children().first();
        expect(result).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          childAge: 1,
          childName: 'child_name_1',
          errors: { childAge: [], childName: [] },
          id: 1,
          parentId: 1,
        });
      });
    });

    describe("when specify 'limit'", () => {
      it('should correctly', async () => {
        const result = await record.children().first(2);
        expect(result).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
            _destroyed: false,
            _newRecord: false,
            childAge: 2,
            childName: 'child_name_2',
            errors: { childAge: [], childName: [] },
            id: 2,
            parentId: 1,
          },
        ]);
      });
    });

    describe("when specify 'limit' over range", () => {
      it('should correctly', async () => {
        const result = await record.children().first(100);
        expect(result).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
            _destroyed: false,
            _newRecord: false,
            childAge: 3,
            childName: 'child_name_3',
            errors: { childAge: [], childName: [] },
            id: 3,
            parentId: 1,
          },
        ]);
      });
    });

    describe('when record do not exist', () => {
      it('should return null', async () => {
        const result = await record.children().limit(0).first();
        expect(result).toEqual(null);
      });
    });
  });

  describe('#isEmpty (inherited)', () => {
    describe('when return true', () => {
      it('should correctly', async () => {
        const result = await record.children().limit(0).isEmpty();
        expect(result).toEqual(true);
      });
    });

    describe('when return false', () => {
      it('should correctly', async () => {
        const result = await record.children().isEmpty();
        expect(result).toEqual(false);
      });
    });
  });

  describe('#isInclude (inherited)', () => {
    describe('when return true', () => {
      describe('when default', () => {
        it('should correctly', async () => {
          const foundRecord = await CollectionProxyChildRecord.findBy<
            CollectionProxyChildRecord,
            CollectionProxyChildRecordParams
          >({ id: 1 });
          const result = await record.children().isInclude(foundRecord);
          expect(result).toEqual(true);
        });
      });

      describe("when specify 'Promise<Record>'", () => {
        it('should correctly', async () => {
          const foundRecord = CollectionProxyChildRecord.findBy<
            CollectionProxyChildRecord,
            CollectionProxyChildRecordParams
          >({ id: 1 });
          const result = await record.children().isInclude(foundRecord);
          expect(result).toEqual(true);
        });
      });
    });

    describe('when return false', () => {
      describe('when specify many records', () => {
        it('should correctly', async () => {
          // TODO: remove array
          const foundRecords = await CollectionProxyChildRecord.findBy<
            CollectionProxyChildRecord,
            CollectionProxyChildRecordParams
          >({ id: [100, 200] as any });
          const result = await record.children().isInclude(foundRecords);
          expect(result).toEqual(false);
        });
      });

      describe("when specify 'Promise<Record[]>'", () => {
        it('should correctly', async () => {
          // TODO: remove array
          const foundRecords = CollectionProxyChildRecord.findBy<
            CollectionProxyChildRecord,
            CollectionProxyChildRecordParams
          >({ id: [100, 200] as any });
          const result = await record.children().isInclude(foundRecords);
          expect(result).toEqual(false);
        });
      });

      describe("when specify 'Promise<undefined>'", () => {
        it('should correctly', async () => {
          const result = await record.children().isInclude(Promise.resolve(undefined));
          expect(result).toEqual(false);
        });
      });
    });
  });

  describe('#last', () => {
    describe('when default', () => {
      it('should return first record', async () => {
        const result = await record.children().last();
        expect(result).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 3,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          childAge: 3,
          childName: 'child_name_3',
          errors: { childAge: [], childName: [] },
          id: 3,
          parentId: 1,
        });
      });
    });

    describe("when specify 'limit'", () => {
      it('should correctly', async () => {
        const result = await record.children().last(2);
        expect(result).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
            _destroyed: false,
            _newRecord: false,
            childAge: 3,
            childName: 'child_name_3',
            errors: { childAge: [], childName: [] },
            id: 3,
            parentId: 1,
          },
        ]);
      });
    });

    describe("when specify 'limit' over range", () => {
      it('should correctly', async () => {
        const result = await record.children().last(100);
        expect(result).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
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
            _destroyed: false,
            _newRecord: false,
            childAge: 3,
            childName: 'child_name_3',
            errors: { childAge: [], childName: [] },
            id: 3,
            parentId: 1,
          },
        ]);
      });
    });

    describe('when record do not exist', () => {
      it('should return null', async () => {
        const result = await record.children().limit(0).last();
        expect(result).toEqual(null);
      });
    });
  });

  describe('#isMany (inherited)', () => {
    describe('when return true', () => {
      it('should correcly', async () => {
        const result = await record.children().isMany();
        expect(result).toEqual(true);
      });
    });

    describe('when result false', () => {
      it('should correctly', async () => {
        const result = await record.children().limit(0).isMany();
        expect(result).toEqual(false);
      });
    });
  });

  describe('#count (inherited)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record.children().size();
        expect(result).toEqual(3);
      });
    });

    describe('when mix', () => {
      it('should correctly', async () => {
        const result = await record.children().limit(2).size();
        expect(result).toEqual(2);
      });
    });
  });

  describe('#take (inherited)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record.children().take();
        expect(result).toEqual({
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _destroyed: false,
          _newRecord: false,
          childAge: 1,
          childName: 'child_name_1',
          errors: { childName: [], childAge: [] },
          id: 1,
          parentId: 1,
        });
      });
    });

    describe("when specify 'limit'", () => {
      it('should correctly', async () => {
        const result = await record.children().take(2);
        expect(result).toEqual([
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 1,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            childAge: 1,
            childName: 'child_name_1',
            errors: { childName: [], childAge: [] },
            id: 1,
            parentId: 1,
          },
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 2,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            childAge: 2,
            childName: 'child_name_2',
            errors: { childName: [], childAge: [] },
            id: 2,
            parentId: 1,
          },
        ]);
      });
    });
  });
});
