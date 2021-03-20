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

  // https://railsguides.jp/association_basics.html#has-many-through%E3%81%A8has-and-belongs-to-many%E3%81%AE%E3%81%A9%E3%81%A1%E3%82%89%E3%82%92%E9%81%B8%E3%81%B6%E3%81%8B
  describe('[static] hasAndBelongsToMany', () => {
    type TestAssociationHasAndBelongsToManyAssemblyParams = {
      id: t.Record$PrimaryKey;
      name: string;
    };

    type TestAssociationHasAndBelongsToManyPartParams = {
      id: t.Record$PrimaryKey;
      name: string;
    };

    class TestAssociationHasAndBelongsToManyAssemblyRecord extends Record<TestAssociationHasAndBelongsToManyAssemblyParams> {
      public id: TestAssociationHasAndBelongsToManyAssemblyParams['id'];
      public parts: t.Record$HasAndBelongsToMany<TestAssociationHasAndBelongsToManyPartRecord>;
      public name: TestAssociationHasAndBelongsToManyAssemblyParams['name'];

      protected fetchAll(): Promise<TestAssociationHasAndBelongsToManyAssemblyParams[]> {
        return Promise.resolve([
          { id: 1, name: 'assembly_name_1' },
          { id: 2, name: 'assembly_name_2' },
          { id: 3, name: 'assembly_name_3' },
          { id: 4, name: 'assembly_name_4' },
        ]);
      }
    }
    class TestAssociationHasAndBelongsToManyPartRecord extends Record<TestAssociationHasAndBelongsToManyPartParams> {
      public id: TestAssociationHasAndBelongsToManyPartParams['id'];
      public assemblies: t.Record$HasAndBelongsToMany<TestAssociationHasAndBelongsToManyAssemblyRecord>;
      public name: TestAssociationHasAndBelongsToManyPartParams['name'];

      protected fetchAll(): Promise<TestAssociationHasAndBelongsToManyPartParams[]> {
        return Promise.resolve([
          { id: 1, name: 'part_name_1' },
          { id: 2, name: 'part_name_2' },
          { id: 3, name: 'part_name_3' },
          { id: 4, name: 'part_name_4' },
        ]);
      }
    }

    // register relations
    TestAssociationHasAndBelongsToManyAssemblyRecord.hasAndBelongsToMany<TestAssociationHasAndBelongsToManyPartRecord>(
      'parts',
      {
        klass: TestAssociationHasAndBelongsToManyPartRecord,
      }
    );
    TestAssociationHasAndBelongsToManyPartRecord.hasAndBelongsToMany<TestAssociationHasAndBelongsToManyAssemblyRecord>(
      'assemblies',
      {
        klass: TestAssociationHasAndBelongsToManyAssemblyRecord,
      }
    );

    describe("when 'Assembly'", () => {
      it('should correctly', async () => {
        const assemblies = await TestAssociationHasAndBelongsToManyAssemblyRecord.all<TestAssociationHasAndBelongsToManyAssemblyRecord>();
        const parts = await TestAssociationHasAndBelongsToManyPartRecord.all<TestAssociationHasAndBelongsToManyPartRecord>();
        const assembly = assemblies[0];

        assembly.hasAndBelongsToMany(parts[0]);
        assembly.hasAndBelongsToMany(parts[1]);

        const records = await assembly.parts();
        expect(records.length).toEqual(2);
        expect(records[0].id).toEqual(1);
        expect(records[0].name).toEqual('part_name_1');
        expect(records[1].id).toEqual(2);
        expect(records[1].name).toEqual('part_name_2');
      });
    });

    describe("when 'Part'", () => {
      it('should correctly', async () => {
        const assemblies = await TestAssociationHasAndBelongsToManyAssemblyRecord.all<TestAssociationHasAndBelongsToManyAssemblyRecord>();
        const parts = await TestAssociationHasAndBelongsToManyPartRecord.all<TestAssociationHasAndBelongsToManyPartRecord>();
        const part = parts[0];

        part.hasAndBelongsToMany(assemblies[0]);
        part.hasAndBelongsToMany(assemblies[1]);

        const records = await part.assemblies();
        expect(records.length).toEqual(2);
        expect(records[0].id).toEqual(1);
        expect(records[0].name).toEqual('assembly_name_1');
        expect(records[1].id).toEqual(2);
        expect(records[1].name).toEqual('assembly_name_2');
      });
    });
  });

  describe('[static] scope', () => {
    type TestScopeParams = {
      id: t.Record$PrimaryKey;
      name: string;
      age: number;
    };

    class TestScopeRecord extends Record {
      public id: TestScopeParams['id'];
      public name: TestScopeParams['name'];
      public age: TestScopeParams['age'];

      // scope
      static fromName: t.Record$Scope<TestScopeRecord>;

      protected fetchAll(): Promise<TestScopeParams[]> {
        return Promise.resolve([
          { id: 1, name: 'name_1', age: 1 },
          { id: 2, name: 'name_2', age: 2 },
        ]);
      }
    }

    TestScopeRecord.scope('fromName', (self, name) => self.where({ name }));

    it('should correctly', (done) => {
      TestScopeRecord.fromName('name_1').then((records: TestScopeRecord[]) => {
        expect(records.length).toEqual(1);
        expect(records[0].id).toEqual(1);
        expect(records[0].name).toEqual('name_1');
        expect(records[0].age).toEqual(1);
        done();
      });
      TestScopeRecord.fromName('name_2').then((records: TestScopeRecord[]) => {
        expect(records.length).toEqual(1);
        expect(records[0].id).toEqual(2);
        expect(records[0].name).toEqual('name_2');
        expect(records[0].age).toEqual(2);
        done();
      });
    });
  });
});
