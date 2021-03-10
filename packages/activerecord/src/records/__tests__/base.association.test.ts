import { ActiveRecord$Base as Record } from '../base';

// types
import type * as rt from '@/records/modules/associations';

describe('Record(Association)', () => {
  describe('[static] belongsTo', () => {
    type TestAssociationBelongsToParams = {
      name: String;
      age: number;
    };

    type TestAssociationBelongsToChildParams = {
      childName: String;
      childAge: number;
    };

    class TestAssociationBelongsToRecord extends Record {
      public primaryKey: rt.Associations$PrimaryKey;
      public name: TestAssociationBelongsToParams['name'];
      public age: TestAssociationBelongsToParams['age'];

      protected static fetchAll<T = TestAssociationBelongsToParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { primaryKey: 1, name: 'name_1', age: 1 },
          { primaryKey: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationBelongsToChildRecord extends Record {
      public primaryKey: rt.Associations$PrimaryKey;
      public foreignKey: rt.Associations$ForeignKey;
      public childName: TestAssociationBelongsToChildParams['childName'];
      public childAge: TestAssociationBelongsToChildParams['childAge'];
      public parent: rt.Associations$BelongsTo<TestAssociationBelongsToRecord>;

      protected static fetchAll<T = TestAssociationBelongsToChildParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { primaryKey: 1, foreignKey: 1, childName: 'child_name_11', childAge: 11 },
          { primaryKey: 2, foreignKey: 1, childName: 'child_name_21', childAge: 21 },
          { primaryKey: 3, foreignKey: 2, childName: 'child_name_22', childAge: 22 },
          { primaryKey: 4, foreignKey: 2, childName: 'child_name_42', childAge: 42 },
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
        (relation) => {
          const records = relation.toA();
          const record = records[0];
          expect(record.primaryKey).toEqual(1);
          expect(record.foreignKey).toEqual(1);
          expect(record.childName).toEqual('child_name_11');
          expect(record.childAge).toEqual(11);

          record.parent().then((record) => {
            expect(record.primaryKey).toEqual(1);
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
      name: String;
      age: number;
    };

    type TestAssociationHasOneChildParams = {
      childName: String;
      childAge: number;
    };

    class TestAssociationHasOneRecord extends Record {
      public primaryKey: rt.Associations$PrimaryKey;
      public name: TestAssociationHasOneParams['name'];
      public age: TestAssociationHasOneParams['age'];
      public child: rt.Associations$HasOne<TestAssociationHasOneChildRecord>;

      protected static fetchAll<T = TestAssociationHasOneParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { primaryKey: 1, name: 'name_1', age: 1 },
          { primaryKey: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationHasOneChildRecord extends Record {
      public primaryKey: rt.Associations$PrimaryKey;
      public foreignKey: rt.Associations$ForeignKey;
      public childName: TestAssociationHasOneChildParams['childName'];
      public childAge: TestAssociationHasOneChildParams['childAge'];

      protected static fetchAll<T = TestAssociationHasOneChildParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { primaryKey: 1, foreignKey: 1, childName: 'child_name_11', childAge: 11 },
          { primaryKey: 2, foreignKey: 2, childName: 'child_name_22', childAge: 22 },
        ]);
      }
    }

    // register relations
    TestAssociationHasOneRecord.hasOne('child', TestAssociationHasOneChildRecord, 'foreignKey');

    it('should correctly', (done) => {
      TestAssociationHasOneRecord.all<TestAssociationHasOneRecord>().then((relation) => {
        const records = relation.toA();
        const record = records[0];
        expect(record.primaryKey).toEqual(1);
        expect(record.name).toEqual('name_1');
        expect(record.age).toEqual(1);

        record.child().then((record) => {
          expect(record.primaryKey).toEqual(1);
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
      name: String;
      age: number;
    };

    type TestAssociationHasManyChildParams = {
      childName: String;
      childAge: number;
    };

    class TestAssociationHasManyRecord extends Record {
      public primaryKey: rt.Associations$PrimaryKey;
      public name: TestAssociationHasManyParams['name'];
      public age: TestAssociationHasManyParams['age'];
      public children: rt.Associations$HasMany<TestAssociationHasManyChildRecord>;

      protected static fetchAll<T = TestAssociationHasManyParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { primaryKey: 1, name: 'name_1', age: 1 },
          { primaryKey: 2, name: 'name_2', age: 2 },
        ]);
      }
    }
    class TestAssociationHasManyChildRecord extends Record {
      public primaryKey: rt.Associations$PrimaryKey;
      public foreignKey: rt.Associations$ForeignKey;
      public childName: TestAssociationHasManyChildParams['childName'];
      public childAge: TestAssociationHasManyChildParams['childAge'];

      protected static fetchAll<T = TestAssociationHasManyChildParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { primaryKey: 1, foreignKey: 1, childName: 'child_name_11', childAge: 11 },
          { primaryKey: 2, foreignKey: 1, childName: 'child_name_21', childAge: 21 },
          { primaryKey: 3, foreignKey: 2, childName: 'child_name_22', childAge: 22 },
          { primaryKey: 4, foreignKey: 2, childName: 'child_name_42', childAge: 42 },
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
      TestAssociationHasManyRecord.all<TestAssociationHasManyRecord>().then((relation) => {
        const records = relation.toA();
        const record = records[0];
        expect(record.primaryKey).toEqual(1);
        expect(record.name).toEqual('name_1');
        expect(record.age).toEqual(1);

        record.children().then((relation) => {
          const records = relation.toA();
          expect(records.length).toEqual(2);
          expect(records[0].primaryKey).toEqual(1);
          expect(records[0].foreignKey).toEqual(1);
          expect(records[0].childName).toEqual('child_name_11');
          expect(records[0].childAge).toEqual(11);
          expect(records[1].primaryKey).toEqual(2);
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
      name: string;
    };

    type TestAssociationHasAndBelongsToManyPartParams = {
      name: string;
    };

    class TestAssociationHasAndBelongsToManyAssemblyRecord extends Record {
      public primaryKey: rt.Associations$PrimaryKey;
      public parts: rt.Associations$HasAndBelongsToMany<TestAssociationHasAndBelongsToManyPartRecord>;
      public name: TestAssociationHasAndBelongsToManyAssemblyParams['name'];

      protected static fetchAll<T = TestAssociationHasAndBelongsToManyAssemblyRecord>(): Promise<
        T[]
      > {
        // @ts-ignore
        return Promise.resolve([
          { primaryKey: 1, name: 'assembly_name_1' },
          { primaryKey: 2, name: 'assembly_name_2' },
          { primaryKey: 3, name: 'assembly_name_3' },
          { primaryKey: 4, name: 'assembly_name_4' },
        ]);
      }
    }
    class TestAssociationHasAndBelongsToManyPartRecord extends Record {
      public primaryKey: rt.Associations$PrimaryKey;
      public assemblies: rt.Associations$HasAndBelongsToMany<TestAssociationHasAndBelongsToManyAssemblyRecord>;
      public name: TestAssociationHasAndBelongsToManyPartParams['name'];

      protected static fetchAll<T = TestAssociationHasAndBelongsToManyPartParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { primaryKey: 1, name: 'part_name_1' },
          { primaryKey: 2, name: 'part_name_2' },
          { primaryKey: 3, name: 'part_name_3' },
          { primaryKey: 4, name: 'part_name_4' },
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
      it('should correctly', async (done) => {
        const assemblies = await (
          await TestAssociationHasAndBelongsToManyAssemblyRecord.all<TestAssociationHasAndBelongsToManyAssemblyRecord>()
        ).toA();
        const parts = await (
          await TestAssociationHasAndBelongsToManyPartRecord.all<TestAssociationHasAndBelongsToManyPartRecord>()
        ).toA();
        const assembly = assemblies[0];

        assembly.hasAndBelongsToMany(parts[0]);
        assembly.hasAndBelongsToMany(parts[1]);

        assembly
          .parts()
          .then((relation) => {
            const records = relation.toA();
            expect(records.length).toEqual(2);
            expect(records[0].primaryKey).toEqual(1);
            expect(records[0].name).toEqual('part_name_1');
            expect(records[1].primaryKey).toEqual(2);
            expect(records[1].name).toEqual('part_name_2');
            done();
          })
          .catch((e) => console.error(e));
      });
    });

    describe("when 'Part'", () => {
      it('should correctly', async (done) => {
        const assemblies = await (
          await TestAssociationHasAndBelongsToManyAssemblyRecord.all<TestAssociationHasAndBelongsToManyAssemblyRecord>()
        ).toA();
        const parts = await (
          await TestAssociationHasAndBelongsToManyPartRecord.all<TestAssociationHasAndBelongsToManyPartRecord>()
        ).toA();
        const part = parts[0];

        part.hasAndBelongsToMany(assemblies[0]);
        part.hasAndBelongsToMany(assemblies[1]);

        part.assemblies().then((relation) => {
          const records = relation.toA();
          expect(records.length).toEqual(2);
          expect(records[0].primaryKey).toEqual(1);
          expect(records[0].name).toEqual('assembly_name_1');
          expect(records[1].primaryKey).toEqual(2);
          expect(records[1].name).toEqual('assembly_name_2');
          done();
        });
      });
    });
  });

  describe('[static] scope', () => {
    type TestScopeParams = {
      primaryKey: rt.Associations$PrimaryKey;
      name: string;
      age: number;
    };

    class TestScopeRecord extends Record {
      public primaryKey: TestScopeParams['primaryKey'];
      public name: TestScopeParams['name'];
      public age: TestScopeParams['age'];

      // scope
      static fromName: rt.Associations$CollectionProxy$Scope<TestScopeRecord>;

      protected static fetchAll<T = TestScopeParams>(): Promise<T[]> {
        // @ts-ignore
        return Promise.resolve([
          { primaryKey: 1, name: 'name_1', age: 1 },
          { primaryKey: 2, name: 'name_2', age: 2 },
        ]);
      }
    }

    TestScopeRecord.scope('fromName', (name) => TestScopeRecord.where({ name: name }));

    it('should correctly', (done) => {
      TestScopeRecord.fromName('name_1').then((relation) => {
        const records = relation.toA();
        expect(records.length).toEqual(1);
        expect(records[0].primaryKey).toEqual(1);
        expect(records[0].name).toEqual('name_1');
        expect(records[0].age).toEqual(1);
        done();
      });
      TestScopeRecord.fromName('name_2').then((relation) => {
        const records = relation.toA();
        expect(records.length).toEqual(1);
        expect(records[0].primaryKey).toEqual(2);
        expect(records[0].name).toEqual('name_2');
        expect(records[0].age).toEqual(2);
        done();
      });
    });
  });
});
