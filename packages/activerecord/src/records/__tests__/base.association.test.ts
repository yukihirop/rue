import { ActiveRecord$Base as Record } from '../base';

// types
import type * as t from '@/index';
import type * as rt from '@/records/modules/associations';

describe('Record(Association)', () => {
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
      public id: rt.Associations$PrimaryKey;
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
      public parent: rt.Associations$BelongsTo<TestAssociationBelongsToRecord>;

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
      public child: rt.Associations$HasOne<TestAssociationHasOneChildRecord>;

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

  describe('[static] hasMany', () => {
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
      public children: rt.Associations$HasMany<TestAssociationHasManyChildRecord>;

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
    TestAssociationHasManyRecord.hasMany(
      'children',
      TestAssociationHasManyChildRecord,
      'foreignKey'
    );

    it('should correctly', (done) => {
      TestAssociationHasManyRecord.all<TestAssociationHasManyRecord>().then((records) => {
        const record = records[0];
        expect(record.id).toEqual(1);
        expect(record.name).toEqual('name_1');
        expect(record.age).toEqual(1);

        record.children().then((records) => {
          expect(records.length).toEqual(2);
          expect(records[0].id).toEqual(1);
          expect(records[0].foreignKey).toEqual(1);
          expect(records[0].childName).toEqual('child_name_11');
          expect(records[0].childAge).toEqual(11);
          expect(records[1].id).toEqual(2);
          expect(records[1].foreignKey).toEqual(1);
          expect(records[1].childName).toEqual('child_name_21');
          expect(records[1].childAge).toEqual(21);
          done();
        });
      });
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
      public parts: rt.Associations$HasAndBelongsToMany<TestAssociationHasAndBelongsToManyPartRecord>;
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
      public assemblies: rt.Associations$HasAndBelongsToMany<TestAssociationHasAndBelongsToManyAssemblyRecord>;
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
    TestAssociationHasAndBelongsToManyAssemblyRecord.hasAndBelongsToMany(
      'parts',
      TestAssociationHasAndBelongsToManyPartRecord
    );
    TestAssociationHasAndBelongsToManyPartRecord.hasAndBelongsToMany(
      'assemblies',
      TestAssociationHasAndBelongsToManyAssemblyRecord
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
      id: rt.Associations$PrimaryKey;
      name: string;
      age: number;
    };

    class TestScopeRecord extends Record {
      public id: TestScopeParams['id'];
      public name: TestScopeParams['name'];
      public age: TestScopeParams['age'];

      // scope
      static fromName: rt.Associations$CollectionProxy$Scope<TestScopeRecord>;

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
