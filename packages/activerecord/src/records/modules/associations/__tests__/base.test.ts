// classes
import { ActiveRecord$Associations as AssociationsModule } from '../core';
import { registryForAssociations as AssociationsRegistry } from '@/registries';
import { cacheForIntermeditateTables as IntermediateTable } from '@/registries';

// types
import type * as t from '../types';

describe('ActiveRecord$Associations', () => {
  describe(`[static] belongsTo`, () => {
    class TestBelongsToRecord {
      static belongsTo: <T extends AssociationsModule = any>(
        relationName: string,
        klass: Function,
        foreignKey: string
      ) => void;

      public id: t.PrimaryKey;
    }
    class TestBelongsToChildRecod {
      public id: t.PrimaryKey;
      public foreignKey: t.ForeignKey;
      public parent: t.BelongsTo<TestBelongsToRecord>;

      static belongsTo: <T extends AssociationsModule = any>(
        relationName: string,
        klass: Function,
        foreignKey: string
      ) => void;
    }

    AssociationsModule.rueModuleExtendedFrom(TestBelongsToRecord, { only: ['belongsTo'] });
    AssociationsModule.rueModuleExtendedFrom(TestBelongsToChildRecod, { only: ['belongsTo'] });

    // register relations
    TestBelongsToChildRecod.belongsTo('parent', TestBelongsToRecord, 'foreignKey');

    it('should correctly', () => {
      expect(
        AssociationsRegistry.data['TestBelongsToChildRecod']['belongsTo']['parent'].toString()
      ).toEqual('(self) => klass.findBy({ id: self[foreignKey] })');
    });
  });

  describe(`[static] hasOne`, () => {
    class TestHasOneRecord {
      public id: t.PrimaryKey;
      public child: t.HasOne<TestHasOneChildRecod>;

      static hasOne: <T extends AssociationsModule = any>(
        relationName: string,
        klass: Function,
        foreignKey: t.ForeignKey
      ) => void;
    }
    class TestHasOneChildRecod {
      public id: t.PrimaryKey;
    }

    AssociationsModule.rueModuleExtendedFrom(TestHasOneRecord, { only: ['hasOne'] });
    AssociationsModule.rueModuleExtendedFrom(TestHasOneChildRecod, { only: ['hasOne'] });

    // register relations
    TestHasOneRecord.hasOne('child', TestHasOneChildRecod, 'child_id');

    it('should correctly', () => {
      expect(AssociationsRegistry.data['TestHasOneRecord']['hasOne']['child'].toString()).toEqual(
        '(self) => klass.findBy({ [foreignKey]: self.id })'
      );
    });
  });

  describe(`[static] hasMany`, () => {
    class TestHasManyRecord {
      public id: t.PrimaryKey;
      public children: t.HasOne<TestHasManyChildRecod>;

      static hasMany: <T extends AssociationsModule = any>(
        relationName: string,
        klass: Function,
        foreignKey: t.ForeignKey
      ) => void;
    }

    class TestHasManyChildRecod {
      public id: t.PrimaryKey;

      static hasMany: <T extends AssociationsModule = any>(
        relationName: string,
        klass: Function,
        foreignKey: t.ForeignKey
      ) => void;
    }

    AssociationsModule.rueModuleExtendedFrom(TestHasManyRecord, { only: ['hasMany'] });
    AssociationsModule.rueModuleExtendedFrom(TestHasManyChildRecod, { only: ['hasMany'] });

    // register relations
    TestHasManyRecord.hasMany('children', TestHasManyChildRecod, 'child_id');

    it('should correctly', () => {
      expect(
        JSON.stringify(
          AssociationsRegistry.data['TestHasManyRecord']['hasMany']['children'].toString()
        )
      ).not.toEqual('');
    });
  });

  // https://railsguides.jp/association_basics.html#has-many-through%E3%81%A8has-and-belongs-to-many%E3%81%AE%E3%81%A9%E3%81%A1%E3%82%89%E3%82%92%E9%81%B8%E3%81%B6%E3%81%8B
  describe(`[static] hasAndBelongsToMany`, () => {
    class TestHasAndBelongsToManyAssemblyRecord {
      public id: t.PrimaryKey;
      public parts: t.HasAndBelongsToMany<TestHasAndBelongsToManyPartRecord>;

      static hasAndBelongsToMany: <T extends AssociationsModule = any>(
        relationName,
        klass: Function
      ) => void;
    }
    class TestHasAndBelongsToManyPartRecord {
      public id: t.PrimaryKey;
      public assemblies: t.HasAndBelongsToMany<TestHasAndBelongsToManyAssemblyRecord>;

      static hasAndBelongsToMany: <T extends AssociationsModule = any>(
        relationName,
        klass: Function
      ) => void;
    }

    AssociationsModule.rueModuleExtendedFrom(TestHasAndBelongsToManyAssemblyRecord, {
      only: ['hasAndBelongsToMany'],
    });
    AssociationsModule.rueModuleExtendedFrom(TestHasAndBelongsToManyPartRecord, {
      only: ['hasAndBelongsToMany'],
    });

    // register relations
    TestHasAndBelongsToManyAssemblyRecord.hasAndBelongsToMany(
      'parts',
      TestHasAndBelongsToManyPartRecord
    );
    TestHasAndBelongsToManyPartRecord.hasAndBelongsToMany(
      'assemblies',
      TestHasAndBelongsToManyAssemblyRecord
    );

    it('should correctly', () => {
      expect(
        AssociationsRegistry.data['TestHasAndBelongsToManyAssemblyRecord']['hasAndBelongsToMany'][
          'parts'
        ].toString()
      ).toEqual('(self) => klass.where({ id: foreignKeysFn(self) })');
      expect(
        AssociationsRegistry.data['TestHasAndBelongsToManyPartRecord']['hasAndBelongsToMany'][
          'assemblies'
        ].toString()
      ).toEqual('(self) => klass.where({ id: foreignKeysFn(self) })');
    });
  });

  describe('#hasAndBelongsToMany', () => {
    class TestHasAndBelongsToManyFooRecord {
      public id: t.PrimaryKey;
      public name: string;
      public bars: t.HasAndBelongsToMany<TestHasAndBelongsToManyBarRecord>;

      static hasAndBelongsToMany: <T extends AssociationsModule = any>(
        relationName,
        klass: Function
      ) => void;

      constructor(data) {
        this.id = data['id'];
        this.name = data['name'];
      }
    }

    class TestHasAndBelongsToManyBarRecord {
      public id: t.PrimaryKey;
      public name: string;
      public foos: t.HasAndBelongsToMany<TestHasAndBelongsToManyFooRecord>;

      static hasAndBelongsToMany: <T extends AssociationsModule = any>(
        relationName,
        klass: Function
      ) => void;

      constructor(data) {
        this.id = data['id'];
        this.name = data['name'];
      }
    }

    interface TestHasAndBelongsToManyFooRecord {
      hasAndBelongsToMany<T extends AssociationsModule = any>(
        record: T
      ): { [key: string]: t.ForeignKey };
    }

    interface TestHasAndBelongsToManyBarRecord {
      hasAndBelongsToMany<T extends AssociationsModule = any>(
        record: T
      ): { [key: string]: t.ForeignKey };
    }

    AssociationsModule.rueModuleExtendedFrom(TestHasAndBelongsToManyFooRecord, {
      only: ['hasAndBelongsToMany'],
    });
    AssociationsModule.rueModuleExtendedFrom(TestHasAndBelongsToManyBarRecord, {
      only: ['hasAndBelongsToMany'],
    });

    AssociationsModule.rueModuleIncludedFrom(TestHasAndBelongsToManyFooRecord, {
      only: ['hasAndBelongsToMany'],
    });
    AssociationsModule.rueModuleIncludedFrom(TestHasAndBelongsToManyBarRecord, {
      only: ['hasAndBelongsToMany'],
    });

    // register associations
    TestHasAndBelongsToManyFooRecord.hasAndBelongsToMany('bazs', TestHasAndBelongsToManyBarRecord);
    TestHasAndBelongsToManyBarRecord.hasAndBelongsToMany('foos', TestHasAndBelongsToManyFooRecord);

    describe('when success', () => {
      it('should correctly', () => {
        const foos = [1, 2, 3, 4].map((num) => {
          return new TestHasAndBelongsToManyFooRecord({
            id: num,
            name: `foo_${num}`,
          });
        });

        const bars = [1, 2, 3, 4].map((num) => {
          return new TestHasAndBelongsToManyBarRecord({
            id: num,
            name: `bar_${num}`,
          });
        });

        const result_1 = foos[0].hasAndBelongsToMany(bars[0] as any);
        const result_2 = foos[0].hasAndBelongsToMany(bars[1] as any);
        expect(result_1).toEqual({
          TestHasAndBelongsToManyBarRecord: 1,
          TestHasAndBelongsToManyFooRecord: 1,
        });
        expect(result_2).toEqual({
          TestHasAndBelongsToManyBarRecord: 2,
          TestHasAndBelongsToManyFooRecord: 1,
        });
        expect(
          IntermediateTable.read(
            'TestHasAndBelongsToManyFooRecord',
            'TestHasAndBelongsToManyBarRecord'
          )
        ).toEqual([
          [1, 1],
          [1, 2],
        ]);
      });
    });
  });

  describe('#releaseAndBelongsToMany', () => {
    class TestReleaseAndBelongsToManyFooRecord {
      public id: t.PrimaryKey;
      public name: string;
      public bars: t.HasAndBelongsToMany<TestReleaseAndBelongsToManyBarRecord>;

      static hasAndBelongsToMany: <T extends AssociationsModule = any>(
        relationName,
        klass: Function
      ) => void;

      constructor(data) {
        this.id = data['id'];
        this.name = data['name'];
      }
    }

    class TestReleaseAndBelongsToManyBarRecord {
      public id: t.PrimaryKey;
      public name: string;
      public foos: t.HasAndBelongsToMany<TestReleaseAndBelongsToManyFooRecord>;

      static hasAndBelongsToMany: <T extends AssociationsModule = any>(
        relationName,
        klass: Function
      ) => void;

      constructor(data) {
        this.id = data['id'];
        this.name = data['name'];
      }
    }

    interface TestReleaseAndBelongsToManyFooRecord {
      hasAndBelongsToMany<T extends AssociationsModule = any>(
        record: T
      ): { [key: string]: t.ForeignKey };
      releaseAndBelongsToMany<T extends AssociationsModule = any>(
        record: T
      ): { [key: string]: t.ForeignKey };
    }

    interface TestReleaseAndBelongsToManyBarRecord {
      hasAndBelongsToMany<T extends AssociationsModule = any>(
        record: T
      ): { [key: string]: t.ForeignKey };
      releaseAndBelongsToMany<T extends AssociationsModule = any>(
        record: T
      ): { [key: string]: t.ForeignKey };
    }

    AssociationsModule.rueModuleExtendedFrom(TestReleaseAndBelongsToManyFooRecord, {
      only: ['hasAndBelongsToMany'],
    });
    AssociationsModule.rueModuleExtendedFrom(TestReleaseAndBelongsToManyBarRecord, {
      only: ['hasAndBelongsToMany'],
    });

    AssociationsModule.rueModuleIncludedFrom(TestReleaseAndBelongsToManyFooRecord, {
      only: ['hasAndBelongsToMany', 'releaseAndBelongsToMany'],
    });
    AssociationsModule.rueModuleIncludedFrom(TestReleaseAndBelongsToManyBarRecord, {
      only: ['hasAndBelongsToMany', 'releaseAndBelongsToMany'],
    });

    // register associations
    TestReleaseAndBelongsToManyFooRecord.hasAndBelongsToMany(
      'bazs',
      TestReleaseAndBelongsToManyBarRecord
    );
    TestReleaseAndBelongsToManyBarRecord.hasAndBelongsToMany(
      'foos',
      TestReleaseAndBelongsToManyFooRecord
    );

    describe('when success', () => {
      it('should correctly', () => {
        const foos = [1, 2, 3, 4].map((num) => {
          return new TestReleaseAndBelongsToManyFooRecord({
            id: num,
            name: `foo_${num}`,
          });
        });

        const bars = [1, 2, 3, 4].map((num) => {
          return new TestReleaseAndBelongsToManyBarRecord({
            id: num,
            name: `bar_${num}`,
          });
        });

        foos[0].hasAndBelongsToMany(bars[0] as any);
        foos[0].hasAndBelongsToMany(bars[1] as any);

        expect(
          IntermediateTable.read(
            'TestHasAndBelongsToManyFooRecord',
            'TestHasAndBelongsToManyBarRecord'
          )
        ).toEqual([
          [1, 1],
          [1, 2],
        ]);

        const result_1 = foos[0].releaseAndBelongsToMany(bars[0] as any);
        const result_2 = foos[0].releaseAndBelongsToMany(bars[1] as any);

        expect(result_1).toEqual({
          TestReleaseAndBelongsToManyBarRecord: 1,
          TestReleaseAndBelongsToManyFooRecord: 1,
        });
        expect(result_2).toEqual({
          TestReleaseAndBelongsToManyBarRecord: 2,
          TestReleaseAndBelongsToManyFooRecord: 1,
        });
      });
    });

    describe('when throw error', () => {
      class TestReleaseAndBelongsToManyBazRecord {
        public id: t.PrimaryKey;
        public name: string;

        constructor(data) {
          this.id = data['id'];
          this.name = data['name'];
        }
      }

      interface TestReleaseAndBelongsToManyBazRecord {
        releaseAndBelongsToMany<T extends AssociationsModule = any>(
          record: T
        ): { [key: string]: t.ForeignKey };
      }

      AssociationsModule.rueModuleIncludedFrom(TestReleaseAndBelongsToManyBazRecord, {
        only: ['releaseAndBelongsToMany'],
      });

      it('should correctly', () => {
        const foos = [1, 2, 3, 4].map((num) => {
          return new TestReleaseAndBelongsToManyFooRecord({
            id: num,
            name: `foo_${num}`,
          });
        });

        const bazs = [1, 2, 3, 4].map((num) => {
          return new TestReleaseAndBelongsToManyBazRecord({
            id: num,
            name: `bar_${num}`,
          });
        });

        expect(() => {
          foos[0].releaseAndBelongsToMany(bazs[0] as any);
        }).toThrowError(
          "'TestReleaseAndBelongsToManyFooRecord' don't have 'hasAndBelongsToMany' associations with TestReleaseAndBelongsToManyBazRecord."
        );
        expect(() => {
          bazs[0].releaseAndBelongsToMany(foos[0] as any);
        }).toThrowError(
          "'TestReleaseAndBelongsToManyBazRecord' don't have 'hasAndBelongsToMany' associations with TestReleaseAndBelongsToManyFooRecord."
        );
      });
    });
  });
});
