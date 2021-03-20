// classes
import { ActiveRecord$Associations as AssociationsModule } from '../core';
import { registryForAssociations as AssociationsRegistry } from '@/registries';
import { ActiveRecord$Base as Record } from '@/records';

// types
import type * as t from '../types';
import type * as at from '@/records/modules/associations';

describe('ActiveRecord$Associations', () => {
  describe(`[static] belongsTo`, () => {
    class TestBelongsToRecord extends Record {
      static belongsTo: (relationName: string, klass: Function, foreignKey: string) => void;

      public id: t.PrimaryKey;
    }
    class TestBelongsToChildRecod extends Record {
      public id: t.PrimaryKey;
      public foreignKey: t.ForeignKey;
      public parent: t.BelongsTo<TestBelongsToRecord>;

      static belongsTo: (relationName: string, klass: Function, foreignKey: string) => void;
    }

    AssociationsModule.rueModuleExtendedFrom(TestBelongsToRecord, { only: ['belongsTo'] });
    AssociationsModule.rueModuleExtendedFrom(TestBelongsToChildRecod, { only: ['belongsTo'] });

    // register relations
    TestBelongsToChildRecod.belongsTo('parent', TestBelongsToRecord, 'foreignKey');

    it('should correctly', () => {
      expect(
        AssociationsRegistry.data['TestBelongsToChildRecod']['belongsTo']['parent'][
          'relationFn'
        ].toString()
      ).toEqual('(self) => klass.findBy({ id: self[foreignKey] })');
    });
  });

  describe(`[static] hasOne`, () => {
    class TestHasOneRecord extends Record {
      public id: t.PrimaryKey;
      public child: t.HasOne<TestHasOneChildRecod>;

      static hasOne: (relationName: string, klass: Function, foreignKey: t.ForeignKey) => void;
    }
    class TestHasOneChildRecod extends Record {
      public id: t.PrimaryKey;
    }

    AssociationsModule.rueModuleExtendedFrom(TestHasOneRecord, { only: ['hasOne'] });
    AssociationsModule.rueModuleExtendedFrom(TestHasOneChildRecod, { only: ['hasOne'] });

    // register relations
    TestHasOneRecord.hasOne('child', TestHasOneChildRecod, 'child_id');

    it('should correctly', () => {
      expect(
        AssociationsRegistry.data['TestHasOneRecord']['hasOne']['child']['relationFn'].toString()
      ).toEqual('(self) => klass.findBy({ [foreignKey]: self.id })');
    });
  });

  describe(`[static] hasMany`, () => {
    class TestHasManyRecord extends Record {
      public id: t.PrimaryKey;
      public children: t.HasMany<TestHasManyChildRecod>;

      static hasMany: <T extends Record>(
        relationName: string,
        opts: at.Associations$HasManyOptions<T>,
        scope?: at.Associations$HasManyScope<T>
      ) => void;
    }

    class TestHasManyChildRecod extends Record {
      public id: t.PrimaryKey;
    }

    AssociationsModule.rueModuleExtendedFrom(TestHasManyRecord, { only: ['hasMany'] });
    AssociationsModule.rueModuleExtendedFrom(TestHasManyChildRecod, { only: ['hasMany'] });

    // register relations
    TestHasManyRecord.hasMany<TestHasManyChildRecod>('children', {
      klass: TestHasManyChildRecod,
      foreignKey: 'parentId',
    });

    it('should correctly', () => {
      expect(
        JSON.stringify(
          AssociationsRegistry.data['TestHasManyRecord']['hasMany']['children'].toString()
        )
      ).not.toEqual('');
    });
  });
});
