// locals
import { ActiveRecord$Base as Record } from '../base';

// thrid party
import MockDate from 'mockdate';

// types
import type * as t from '@/index';

describe('Record(Association)', () => {
  beforeEach(async () => {
    MockDate.set('2021-03-05T23:03:21+09:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('[static] belongsTo', () => {
    type TestAssociationBelongsToParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type TestAssociationBelongsToChildParams = {
      id: t.Record$PrimaryKey;
      foreignKey: t.Record$ForeignKey;
      childName: String;
      childAge: number;
    };

    class TestAssociationBelongsToRecord extends Record {
      public id: TestAssociationBelongsToParams['id'];
      public name: TestAssociationBelongsToParams['name'];
      public age: TestAssociationBelongsToParams['age'];

      protected fetchAll(): Promise<TestAssociationBelongsToParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationBelongsToChildRecord extends Record {
      public id: TestAssociationBelongsToChildParams['id'];
      public foreignKey: TestAssociationBelongsToChildParams['foreignKey'];
      public childName: TestAssociationBelongsToChildParams['childName'];
      public childAge: TestAssociationBelongsToChildParams['childAge'];
      public parent: t.Record$BelongsTo<TestAssociationBelongsToRecord>;

      protected fetchAll(): Promise<TestAssociationBelongsToChildParams[]> {
        return Promise.resolve([
          { id: 1, foreignKey: 1, childName: 'child_name_11', childAge: 11 },
          { id: 2, foreignKey: 1, childName: 'child_name_21', childAge: 21 },
          { id: 3, foreignKey: 2, childName: 'child_name_22', childAge: 22 },
          { id: 4, foreignKey: 2, childName: 'child_name_42', childAge: 42 },
        ]);
      }
    }

    // register relations
    TestAssociationBelongsToChildRecord.belongsTo(
      'parent',
      TestAssociationBelongsToRecord,
      'foreignKey'
    );

    it('should correctly', (done) => {
      TestAssociationBelongsToChildRecord.all<TestAssociationBelongsToChildRecord>().then(
        (records) => {
          const record = records[0];
          expect(record.id).toEqual(1);
          expect(record.foreignKey).toEqual(1);
          expect(record.childName).toEqual('child_name_11');
          expect(record.childAge).toEqual(11);

          record.parent().then((record) => {
            expect(record.id).toEqual(1);
            expect(record.name).toEqual('name_1');
            expect(record.age).toEqual(1);
            done();
          });
        }
      );
    });
  });

  describe('[static] hasOne', () => {
    type TestAssociationHasOneParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type TestAssociationHasOneChildParams = {
      id: t.Record$PrimaryKey;
      foreignKey: t.Record$ForeignKey;
      childName: String;
      childAge: number;
    };

    class TestAssociationHasOneRecord extends Record {
      public id: TestAssociationHasOneParams['id'];
      public name: TestAssociationHasOneParams['name'];
      public age: TestAssociationHasOneParams['age'];
      public child: t.Record$HasOne<TestAssociationHasOneChildRecord>;

      protected fetchAll(): Promise<TestAssociationHasOneParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationHasOneChildRecord extends Record {
      public id: TestAssociationHasOneChildParams['id'];
      public foreignKey: TestAssociationHasOneChildParams['foreignKey'];
      public childName: TestAssociationHasOneChildParams['childName'];
      public childAge: TestAssociationHasOneChildParams['childAge'];

      protected fetchAll(): Promise<TestAssociationHasOneChildParams[]> {
        return Promise.resolve([
          { id: 1, foreignKey: 1, childName: 'child_name_11', childAge: 11 },
          { id: 2, foreignKey: 2, childName: 'child_name_22', childAge: 22 },
        ]);
      }
    }

    // register relations
    TestAssociationHasOneRecord.hasOne('child', TestAssociationHasOneChildRecord, 'foreignKey');

    it('should correctly', (done) => {
      TestAssociationHasOneRecord.all<TestAssociationHasOneRecord>().then((records) => {
        const record = records[0];
        expect(record.id).toEqual(1);
        expect(record.name).toEqual('name_1');
        expect(record.age).toEqual(1);

        record.child().then((record) => {
          expect(record.id).toEqual(1);
          expect(record.foreignKey).toEqual(1);
          expect(record.childName).toEqual('child_name_11');
          expect(record.childAge).toEqual(11);
          done();
        });
      });
    });
  });

  describe('[static] hasMany (default)', () => {
    type TestAssociationHasManyParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type TestAssociationHasManyChildParams = {
      id: t.Record$PrimaryKey;
      foreignKey: t.Record$ForeignKey;
      childName: String;
      childAge: number;
    };

    class TestAssociationHasManyRecord extends Record {
      public id: TestAssociationHasManyParams['id'];
      public name: TestAssociationHasManyParams['name'];
      public age: TestAssociationHasManyParams['age'];
      public children: t.Record$HasMany<TestAssociationHasManyChildRecord>;

      protected fetchAll(): Promise<TestAssociationHasManyParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationHasManyChildRecord extends Record {
      public id: TestAssociationHasManyChildParams['id'];
      public foreignKey: TestAssociationHasManyChildParams['foreignKey'];
      public childName: TestAssociationHasManyChildParams['childName'];
      public childAge: TestAssociationHasManyChildParams['childAge'];

      protected fetchAll(): Promise<TestAssociationHasManyChildParams[]> {
        return Promise.resolve([
          { id: 1, foreignKey: 1, childName: 'child_name_11', childAge: 11 },
          { id: 2, foreignKey: 1, childName: 'child_name_21', childAge: 21 },
          { id: 3, foreignKey: 2, childName: 'child_name_22', childAge: 22 },
          { id: 4, foreignKey: 2, childName: 'child_name_42', childAge: 42 },
        ]);
      }
    }

    // register relations
    TestAssociationHasManyRecord.hasMany<TestAssociationHasManyChildRecord>('children', {
      klass: TestAssociationHasManyChildRecord,
      foreignKey: 'foreignKey',
    });

    it('should correctly', async () => {
      const record = (await TestAssociationHasManyRecord.first<TestAssociationHasManyRecord>()) as TestAssociationHasManyRecord;
      const result = (await record.children()) as TestAssociationHasManyChildRecord[];
      expect(result.length).toEqual(2);
      expect(result).toEqual([
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childAge: 11,
          childName: 'child_name_11',
          errors: {},
          foreignKey: 1,
          id: 1,
        },
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 2,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childAge: 21,
          childName: 'child_name_21',
          errors: {},
          foreignKey: 1,
          id: 2,
        },
      ]);
    });
  });

  describe("[static] hasMany (specify 'through')", () => {
    type TestAssociationHasManyThroughParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type TestAssociationHasManyThroughThroughParams = {
      id: t.Record$PrimaryKey;
      parentId: t.Record$ForeignKey;
      childId: t.Record$ForeignKey;
    };

    type TestAssociationHasManyThroughChildParams = {
      id: t.Record$PrimaryKey;
      childName: String;
      childAge: number;
    };

    class TestAssociationHasManyThroughRecord extends Record<TestAssociationHasManyThroughParams> {
      public id: TestAssociationHasManyThroughParams['id'];
      public name: TestAssociationHasManyThroughParams['name'];
      public age: TestAssociationHasManyThroughParams['age'];
      public children: t.Record$HasMany<TestAssociationHasManyThroughChildRecord>;

      protected fetchAll(): Promise<TestAssociationHasManyThroughParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }

    class TestAssociationHasManyThroughThroughRecord extends Record<TestAssociationHasManyThroughThroughParams> {
      public id: TestAssociationHasManyThroughThroughParams['id'];
      public parentId: TestAssociationHasManyThroughThroughParams['parentId'];
      public childId: TestAssociationHasManyThroughThroughParams['childId'];

      protected fetchAll(): Promise<TestAssociationHasManyThroughThroughParams[]> {
        return Promise.resolve([
          { id: 1, parentId: 1, childId: 1 },
          { id: 2, parentId: 1, childId: 2 },
          { id: 3, parentId: 1, childId: 3 },
          { id: 4, parentId: 2, childId: 4 },
        ]);
      }
    }

    class TestAssociationHasManyThroughChildRecord extends Record<TestAssociationHasManyThroughChildParams> {
      public id: TestAssociationHasManyThroughChildParams['id'];
      public childName: TestAssociationHasManyThroughChildParams['childName'];
      public childAge: TestAssociationHasManyThroughChildParams['childAge'];

      protected fetchAll(): Promise<TestAssociationHasManyThroughChildParams[]> {
        return Promise.resolve([
          { id: 1, childName: 'child_name_11', childAge: 11 },
          { id: 2, childName: 'child_name_21', childAge: 21 },
          { id: 3, childName: 'child_name_22', childAge: 22 },
          { id: 4, childName: 'child_name_42', childAge: 42 },
        ]);
      }
    }

    // register relations
    TestAssociationHasManyThroughRecord.hasMany<
      TestAssociationHasManyThroughChildRecord,
      TestAssociationHasManyThroughThroughRecord
    >('children', {
      klass: TestAssociationHasManyThroughChildRecord,
      /**
       * @description If you specify `through`, the `foreignKey` option is ignored.
       */
      foreignKey: 'ignoredId',
      through: {
        klass: TestAssociationHasManyThroughThroughRecord,
        foreignKey: 'parentId',
        associationForeignKey: 'childId',
      },
    });

    it('should correctly', async () => {
      const record = (await TestAssociationHasManyThroughRecord.first<TestAssociationHasManyThroughRecord>()) as TestAssociationHasManyThroughRecord;
      const result = await record.children();
      expect(result).toEqual([
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childId: 1,
          errors: {},
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
          childId: 2,
          errors: {},
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
          childId: 3,
          errors: {},
          id: 3,
          parentId: 1,
        },
      ]);
    });
  });

  describe("when hasMany (specify 'scope'", () => {
    type TestAssociationHasManyScopeParams = {
      id: t.Record$PrimaryKey;
      name: String;
      age: number;
    };

    type TestAssociationHasManyScopeChildParams = {
      id: t.Record$PrimaryKey;
      parentId: t.Record$ForeignKey;
      childName: String;
      childAge: number;
    };

    class TestAssociationHasManyScopeRecord extends Record {
      public id: TestAssociationHasManyScopeParams['id'];
      public name: TestAssociationHasManyScopeParams['name'];
      public age: TestAssociationHasManyScopeParams['age'];
      public children: t.Record$HasMany<TestAssociationHasManyScopeChildRecord>;

      protected fetchAll(): Promise<TestAssociationHasManyScopeParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationHasManyScopeChildRecord extends Record {
      public id: TestAssociationHasManyScopeChildParams['id'];
      public parentId: TestAssociationHasManyScopeChildParams['parentId'];
      public childName: TestAssociationHasManyScopeChildParams['childName'];
      public childAge: TestAssociationHasManyScopeChildParams['childAge'];

      protected fetchAll(): Promise<TestAssociationHasManyScopeChildParams[]> {
        return Promise.resolve([
          { id: 1, parentId: 1, childName: 'child_name_11', childAge: 11 },
          { id: 2, parentId: 1, childName: 'child_name_21', childAge: 21 },
          { id: 3, parentId: 2, childName: 'child_name_22', childAge: 22 },
          { id: 4, parentId: 2, childName: 'child_name_42', childAge: 42 },
        ]);
      }
    }

    // register relations
    TestAssociationHasManyScopeRecord.hasMany<TestAssociationHasManyScopeChildRecord>(
      'children',
      {
        klass: TestAssociationHasManyScopeChildRecord,
        foreignKey: 'parentId',
      },
      /**
       * @description Limits of type specification in typescript
       */
      (self: any) => self.where({ id: [1, 2] as any })
    );

    it('should correctly', async () => {
      const record = (await TestAssociationHasManyScopeRecord.first<TestAssociationHasManyScopeRecord>()) as TestAssociationHasManyScopeRecord;
      expect(await record.children()).toEqual([
        {
          __rue_created_at__: '2021-03-05T23:03:21+09:00',
          __rue_record_id__: 1,
          __rue_updated_at__: '2021-03-05T23:03:21+09:00',
          _associationCache: {},
          _destroyed: false,
          _newRecord: false,
          childAge: 11,
          childName: 'child_name_11',
          errors: {},
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
          childAge: 21,
          childName: 'child_name_21',
          errors: {},
          id: 2,
          parentId: 1,
        },
      ]);
    });
  });
});
