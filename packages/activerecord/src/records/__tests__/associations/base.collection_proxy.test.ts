import { ActiveRecord$Base, RECORD_ALL } from '@/records/base';
import { cacheForRecords as RecordCache } from '@/registries';

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

CollectionProxyRecord.hasMany<CollectionProxyChildRecord>('children', {
  klass: CollectionProxyChildRecord,
  foreignKey: 'parentId',
});

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

  describe('#where (delegate to `scope`)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record.children().where({ childName: 'child_name_1' });
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
        ]);
      });
    });
  });

  describe('#rewhere (delegate to `scope`)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .where({ childName: 'child_name_1' })
          .rewhere({ childAge: 3 });
        expect(result).toEqual([
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

  describe('#order', () => {
    describe("when specify 'name: 'desc''", () => {
      it('should correctly', async () => {
        const result = await record.children().order({ childName: 'desc' });
        expect(result).toEqual([
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
        ]);
      });
    });

    describe("when specify 'name: 'DESC''", () => {
      it('should correctly', async () => {
        const result = await record.children().order({ childName: 'DESC' });
        expect(result).toEqual([
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
        ]);
      });
    });

    describe("when specify 'name: 'asc''", () => {
      it('should correctly', async () => {
        const result = await record.children().order({ childAge: 'asc' });
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

    describe("when specify 'name: 'ASC''", () => {
      it('should correctly', async () => {
        const result = await record.children().order({ childAge: 'ASC' });
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

    describe('when invalid direction', () => {
      it('should correctly', async () => {
        try {
          await record.children().order({ childName: 'invalid' });
        } catch (err) {
          expect(err.toString()).toEqual(
            "Error: Direction 'invalid' is invalid. Valid directions are: '[asc,desc,ASC,DESC]'"
          );
        }
      });
    });
  });

  describe('#reorder', () => {
    describe("when specify 'name: 'asc''", () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .order({ childName: 'desc' })
          .reorder({ childName: 'asc' });
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

    describe("when specify 'age: 'ASC''", () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .order({ childName: 'DESC' })
          .reorder({ childAge: 'ASC' });
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

    describe("when specify 'name: 'desc''", () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .order({ childAge: 'asc' })
          .order({ childName: 'desc' });
        expect(result).toEqual([
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
        ]);
      });
    });

    describe("when specify 'name: 'DESC''", () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .order({ childAge: 'ASC' })
          .reorder({ childName: 'DESC' });
        expect(result).toEqual([
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
        ]);
      });
    });

    describe('when invalid direction', () => {
      it('should correctly', async () => {
        try {
          await record.children().order({ childName: 'invalid' }).reorder({ childName: 'reorder' });
        } catch (err) {
          expect(err.toString()).toEqual(
            "Error: Direction 'reorder' is invalid. Valid directions are: '[asc,desc,ASC,DESC]'"
          );
        }
      });
    });
  });

  describe('#offset', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record.children().offset(1);
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

    describe('when specify 0', () => {
      it('should correctly', async () => {
        const result = await record.children().offset(0);
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

    describe("when specify 'offset' after specify 'where'", () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .where({ childAge: [1, 2] })
          .offset(1);
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
        ]);
      });
    });

    describe("when specify 'order' after specify 'offset'", () => {
      it('should correctly', async () => {
        const result = await record.children().offset(1).order({ childAge: 'desc' });
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
        ]);
      });
    });
  });

  describe('#limit', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record.children().limit(1);
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
        ]);
      });
    });

    describe('when specify 0', () => {
      it('should return []', async () => {
        const result = await record.children().limit(0);
        expect(result).toEqual([]);
      });
    });

    describe("when specify 'where' after specify 'limit'", () => {
      it('should correctly', async () => {
        // TODO: remove any
        const result = await record
          .children()
          .where({ id: [1, 2] as any })
          .limit(1);
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
        ]);
      });
    });

    describe("when speicfy 'order' after specify 'limit'", () => {
      it('should correctly', async () => {
        const result = await record.children().order({ childAge: 'desc' }).limit(2);
        expect(result).toEqual([
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
  });

  describe('#group', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        await record.children().create({ id: 5, childName: 'child_name_5', childAge: 5 });
        const result = await record.children().group('childName', 'childAge');
        expect(result).toEqual({
          '[child_name_1,1]': [
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
          ],
          '[child_name_2,2]': [
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
          ],
          '[child_name_3,3]': [
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
          ],
          '[child_name_5,5]': [
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 5,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              childAge: 5,
              childName: 'child_name_5',
              errors: { childAge: [], childName: [] },
              id: 5,
              parentId: 1,
            },
          ],
        });
      });
    });
  });

  describe('#unscope (delegate to `scope`)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record
          .children()
          .where({ childName: 'child_name_1' })
          .unscope('where');
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

    describe('when throw errors', () => {
      describe('when do not give arguments', () => {
        it('should correctly', async () => {
          try {
            await record.children().unscope();
          } catch (err) {
            expect(err.toString()).toEqual("Error: 'unscope()' must contain arguments.");
          }
        });
      });

      describe('when give unsupported arguments', () => {
        it('should correctly', async () => {
          try {
            await record.children().unscope('unsupported' as any);
          } catch (err) {
            expect(err.toString()).toEqual(
              "Error: Called 'unscope()' with invalid unscoping argument '[unsupported]'. Valid arguments are '[where,order,offset,limit,group]'."
            );
          }
        });
      });
    });
  });

  describe('#reverseOrder (delegate to `scope`)', () => {
    describe('when default', () => {
      it('should correctly', async () => {
        const result = await record.children().order({ childAge: 'desc' }).reverseOrder();
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

    describe("when call 'reverseOrder' only", () => {
      it('should correctly', async () => {
        const result = await record.children().reverseOrder().reverseOrder();
        expect(result).toEqual([
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

    describe('when specify one args', () => {
      it('should correctly', async () => {
        const result = await record.children().pluck('id');
        expect(result).toEqual([1, 2, 3]);
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

  describe('#find (delegate to `scope`)', () => {
    describe("when specify 'primarykey'", () => {
      it('should correctly', async () => {
        const result = await record.children().find(1);
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

    describe("when specify array of 'id'", () => {
      it('should correctly', async () => {
        const result = await record.children().find(1, 2);
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

    describe('when throw error', () => {
      describe("when do not specify 'id'", () => {
        it('should correctly', async () => {
          try {
            await record.children().find();
          } catch (err) {
            expect(err.toString()).toEqual(
              "Error: Could'nt find 'CollectionProxyChildRecord' without an 'id'"
            );
          }
        });
      });

      describe("when specify don't exists 'id'", () => {
        it('should correctly', async () => {
          try {
            await record.children().find(100);
          } catch (err) {
            expect(err.toString()).toEqual(
              "Error: Couldn't find 'CollectionProxyChildRecord' with 'id' = '100'"
            );
          }
        });
      });

      describe("when specify don't exists array of 'id'", () => {
        it('should correctly', async () => {
          try {
            await record.children().find(100, 200);
          } catch (err) {
            expect(err.toString()).toEqual(
              "Error: Could't find all 'CollectionProxyChildRecord' with 'id': [100,200] (found 0 results, but was looking for 2)"
            );
          }
        });
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

  describe('#delete', () => {
    describe("when default (dependent: 'nullify')", () => {
      describe('when give ids', () => {
        it('should update parentId = undefined', async () => {
          const result = await record.children().delete(1, 2);
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
              parentId: undefined,
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
              parentId: undefined,
            },
          ]);
          expect(await record.children().size()).toEqual(1);
          expect(RecordCache.data[CollectionProxyChildRecord.name][RECORD_ALL]).toEqual([
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
              parentId: undefined,
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
              parentId: undefined,
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
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 4,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              childAge: 4,
              childName: 'child_name_4',
              errors: { childAge: [], childName: [] },
              id: 4,
              parentId: 2,
            },
          ]);
        });
      });

      describe('when give records', () => {
        it('should update parentId = undefined', async () => {
          await CollectionProxyChildRecord.all();
          const records = [
            CollectionProxyChildRecord.find<CollectionProxyChildRecord>(1),
            CollectionProxyChildRecord.find<CollectionProxyChildRecord>(2),
          ] as CollectionProxyChildRecord[];
          const result = await record.children().delete(...records);
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
              parentId: undefined,
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
              parentId: undefined,
            },
          ]);
          expect(await record.children().size()).toEqual(1);
          expect(RecordCache.data[CollectionProxyChildRecord.name][RECORD_ALL]).toEqual([
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
              parentId: undefined,
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
              parentId: undefined,
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
            {
              __rue_created_at__: '2021-03-05T23:03:21+09:00',
              __rue_record_id__: 4,
              __rue_updated_at__: '2021-03-05T23:03:21+09:00',
              _destroyed: false,
              _newRecord: false,
              childAge: 4,
              childName: 'child_name_4',
              errors: { childAge: [], childName: [] },
              id: 4,
              parentId: 2,
            },
          ]);
        });
      });
    });
  });

  describe('#destroy', () => {
    describe("when don't specify ids", () => {
      it('should correctly', async () => {
        const result = await record.children().destroy();
        expect(result).toEqual(null);
      });
    });

    describe('when give ids', () => {
      it('should correctly', async () => {
        const result = await record.children().destroy(1, 2);
        expect(result).toEqual([
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
        ]);
        expect(await record.children().size()).toEqual(1);
        expect(RecordCache.data[CollectionProxyChildRecord.name][RECORD_ALL]).toEqual([
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
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            childAge: 4,
            childName: 'child_name_4',
            errors: { childAge: [], childName: [] },
            id: 4,
            parentId: 2,
          },
        ]);
      });
    });

    describe('when give records', () => {
      it('should correctly', async () => {
        await CollectionProxyChildRecord.all();
        const records = [
          CollectionProxyChildRecord.find(1),
          CollectionProxyChildRecord.find(2),
        ] as CollectionProxyChildRecord[];
        const result = await record.children().destroy(...records);
        expect(result).toEqual([
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
        ]);
        expect(await record.children().size()).toEqual(1);
        expect(RecordCache.data[CollectionProxyChildRecord.name][RECORD_ALL]).toEqual([
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
          {
            __rue_created_at__: '2021-03-05T23:03:21+09:00',
            __rue_record_id__: 4,
            __rue_updated_at__: '2021-03-05T23:03:21+09:00',
            _destroyed: false,
            _newRecord: false,
            childAge: 4,
            childName: 'child_name_4',
            errors: { childAge: [], childName: [] },
            id: 4,
            parentId: 2,
          },
        ]);
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
        const result = await record.children().count();
        expect(result).toEqual(3);
      });
    });

    describe('when mix', () => {
      it('should correctly', async () => {
        const result = await record.children().limit(2).count();
        expect(result).toEqual(2);
      });
    });

    describe('when use group', () => {
      it('should correctly', async () => {
        const result = await record.children().group('id', 'childName').count();
        expect(result).toEqual({
          '[1,child_name_1]': 1,
          '[2,child_name_2]': 1,
          '[3,child_name_3]': 1,
        });
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
