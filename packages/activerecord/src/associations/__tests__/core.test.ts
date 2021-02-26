// classes
import { ActiveRecord$Associations$Base as Association } from '../base';
import { registryForAssociations as Registry } from '@/registries';
import { cacheForIntermeditateTables as IntermediateTable } from '@/registries';

// types
import type * as t from '../types';

describe('Association', () => {
  describe(`[static] belongsTo`, () => {
    class TestBelongsToRecord extends Association {
      public primaryKey: t.PrimaryKey;
    }
    class TestBelongsToChildRecod extends Association {
      public primaryKey: t.PrimaryKey;
      public foreignKey: t.ForeignKey;
      public parent: t.BelongsTo<TestBelongsToRecord>;
    }

    // register relations
    TestBelongsToChildRecod.belongsTo('parent', TestBelongsToRecord, 'foreignKey');

    it('should correctly', () => {
      expect(Registry.data['TestBelongsToChildRecod']['belongsTo']['parent'].toString()).toEqual(
        '(self) => klass.findBy({ primaryKey: self[foreignKey] })'
      );
    });
  });

  describe(`[static] hasOne`, () => {
    class TestHasOneRecord extends Association {
      public primaryKey: t.PrimaryKey;
      public child: t.HasOne<TestHasOneChildRecod>;
    }
    class TestHasOneChildRecod extends Association {
      public primaryKey: t.PrimaryKey;
    }

    // register relations
    TestHasOneRecord.hasOne('child', TestHasOneChildRecod, 'child_id');

    it('should correctly', () => {
      expect(Registry.data['TestHasOneRecord']['hasOne']['child'].toString()).toEqual(
        '(self) => klass.findBy({ [foreignKey]: self.primaryKey })'
      );
    });
  });

  describe(`[static] hasMany`, () => {
    class TestHasManyRecord extends Association {
      public primaryKey: t.PrimaryKey;
      public children: t.HasOne<TestHasManyChildRecod>;
    }
    class TestHasManyChildRecod extends Association {
      public primaryKey: t.PrimaryKey;
    }

    // register relations
    TestHasManyRecord.hasMany('children', TestHasManyChildRecod, 'child_id');

    it('should correctly', () => {
      expect(Registry.data['TestHasManyRecord']['hasMany']['children'].toString()).toEqual(
        '(self) => klass.where({ [foreignKey]: self.primaryKey }).toPromiseArray()'
      );
    });
  });

  // https://railsguides.jp/association_basics.html#has-many-through%E3%81%A8has-and-belongs-to-many%E3%81%AE%E3%81%A9%E3%81%A1%E3%82%89%E3%82%92%E9%81%B8%E3%81%B6%E3%81%8B
  describe(`[static] hasAndBelongsToMany`, () => {
    class TestHasAndBelongsToManyAssemblyRecord extends Association {
      public primaryKey: t.PrimaryKey;
      public parts: t.HasAndBelongsToMany<TestHasAndBelongsToManyPartRecord>;
    }
    class TestHasAndBelongsToManyPartRecord extends Association {
      public primaryKey: t.PrimaryKey;
      public assemblies: t.HasAndBelongsToMany<TestHasAndBelongsToManyAssemblyRecord>;
    }

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
        Registry.data['TestHasAndBelongsToManyAssemblyRecord']['hasAndBelongsToMany'][
          'parts'
        ].toString()
      ).toEqual('(self) => klass.where({ primaryKey: foreignKeysFn(self) }).toPromiseArray()');
      expect(
        Registry.data['TestHasAndBelongsToManyPartRecord']['hasAndBelongsToMany'][
          'assemblies'
        ].toString()
      ).toEqual('(self) => klass.where({ primaryKey: foreignKeysFn(self) }).toPromiseArray()');
    });
  });

  describe('#hasAndBelongsToMany', () => {
    class TestHasAndBelongsToManyFooRecord extends Association {
      public primaryKey: t.PrimaryKey;
      public name: string;
      public bars: t.HasAndBelongsToMany<TestHasAndBelongsToManyBarRecord>;
    }

    class TestHasAndBelongsToManyBarRecord extends Association {
      public primaryKey: t.PrimaryKey;
      public name: string;
      public foos: t.HasAndBelongsToMany<TestHasAndBelongsToManyFooRecord>;
    }

    // register associations
    TestHasAndBelongsToManyFooRecord.hasAndBelongsToMany('bazs', TestHasAndBelongsToManyBarRecord);
    TestHasAndBelongsToManyBarRecord.hasAndBelongsToMany('foos', TestHasAndBelongsToManyFooRecord);

    describe('when success', () => {
      it('should correctly', () => {
        const foos = [1, 2, 3, 4].map((num) => {
          return new TestHasAndBelongsToManyFooRecord({
            primaryKey: num,
            name: `foo_${num}`,
          });
        });

        const bars = [1, 2, 3, 4].map((num) => {
          return new TestHasAndBelongsToManyBarRecord({
            primaryKey: num,
            name: `bar_${num}`,
          });
        });

        const result_1 = foos[0].hasAndBelongsToMany(bars[0]);
        const result_2 = foos[0].hasAndBelongsToMany(bars[1]);
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
    class TestReleaseAndBelongsToManyFooRecord extends Association {
      public primaryKey: t.PrimaryKey;
      public name: string;
      public bars: t.HasAndBelongsToMany<TestReleaseAndBelongsToManyBarRecord>;
    }

    class TestReleaseAndBelongsToManyBarRecord extends Association {
      public primaryKey: t.PrimaryKey;
      public name: string;
      public foos: t.HasAndBelongsToMany<TestReleaseAndBelongsToManyFooRecord>;
    }

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
            primaryKey: num,
            name: `foo_${num}`,
          });
        });

        const bars = [1, 2, 3, 4].map((num) => {
          return new TestReleaseAndBelongsToManyBarRecord({
            primaryKey: num,
            name: `bar_${num}`,
          });
        });

        foos[0].hasAndBelongsToMany(bars[0]);
        foos[0].hasAndBelongsToMany(bars[1]);

        expect(
          IntermediateTable.read(
            'TestHasAndBelongsToManyFooRecord',
            'TestHasAndBelongsToManyBarRecord'
          )
        ).toEqual([
          [1, 1],
          [1, 2],
        ]);

        const result_1 = foos[0].releaseAndBelongsToMany(bars[0]);
        const result_2 = foos[0].releaseAndBelongsToMany(bars[1]);

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
      class TestReleaseAndBelongsToManyBazRecord extends Association {
        public primaryKey: t.PrimaryKey;
        public name: string;
      }

      it('should correctly', () => {
        const foos = [1, 2, 3, 4].map((num) => {
          return new TestReleaseAndBelongsToManyFooRecord({
            primaryKey: num,
            name: `foo_${num}`,
          });
        });

        const bazs = [1, 2, 3, 4].map((num) => {
          return new TestReleaseAndBelongsToManyBazRecord({
            primaryKey: num,
            name: `bar_${num}`,
          });
        });

        expect(() => {
          foos[0].releaseAndBelongsToMany(bazs[0]);
        }).toThrowError(
          "'TestReleaseAndBelongsToManyFooRecord' don't have 'hasAndBelongsToMany' associations with TestReleaseAndBelongsToManyBazRecord."
        );
        expect(() => {
          bazs[0].releaseAndBelongsToMany(foos[0]);
        }).toThrowError(
          "'TestReleaseAndBelongsToManyBazRecord' don't have 'hasAndBelongsToMany' associations with TestReleaseAndBelongsToManyFooRecord."
        );
      });
    });
  });
});
