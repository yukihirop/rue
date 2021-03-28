// classes
import { ActiveRecord$Associations as AssociationsModule } from '../core';
import { registryForAssociations as AssociationsRegistry } from '@/registries';
import { ActiveRecord$Base as Record } from '@/records';

// types
import type * as t from '../types';

describe('ActiveRecord$Associations', () => {
  describe(`[static] belongsTo`, () => {
    class TestBelongsToRecord extends Record {
      public id: t.PrimaryKey;

      get uniqueKey(): string {
        return 'TestBelongsToRecord';
      }
    }
    class TestBelongsToChildRecod extends Record {
      public id: t.PrimaryKey;
      public foreignKey: t.ForeignKey;
      public parent: t.BelongsTo<TestBelongsToRecord>;

      get uniqueKey(): string {
        return 'TestBelongsToChildRecod';
      }
    }

    AssociationsModule.rueModuleExtendedFrom(TestBelongsToRecord, { only: ['belongsTo'] });
    AssociationsModule.rueModuleExtendedFrom(TestBelongsToChildRecod, { only: ['belongsTo'] });

    // register relations
    TestBelongsToChildRecod.belongsTo('parent', {
      klass: TestBelongsToRecord,
      foreignKey: 'foreignKey',
    });

    it('should correctly', () => {
      expect(
        AssociationsRegistry.data['TestBelongsToChildRecod']['belongsTo']['parent'][
          'relationFn'
        ].toString()
      ).not.toEqual('');
    });
  });

  describe(`[static] hasOne`, () => {
    class TestHasOneRecord extends Record {
      public id: t.PrimaryKey;
      public child: t.HasOne<TestHasOneChildRecod>;

      get uniqueKey(): string {
        return 'TestHasOneRecord';
      }
    }

    class TestHasOneChildRecod extends Record {
      public id: t.PrimaryKey;

      get uniqueKey(): string {
        return 'TestHasOneChildRecod';
      }
    }

    AssociationsModule.rueModuleExtendedFrom(TestHasOneRecord, { only: ['hasOne'] });
    AssociationsModule.rueModuleExtendedFrom(TestHasOneChildRecod, { only: ['hasOne'] });

    // register relations
    TestHasOneRecord.hasOne('child', {
      klass: TestHasOneChildRecod,
      foreignKey: 'parentId',
    });

    it('should correctly', () => {
      expect(
        AssociationsRegistry.data['TestHasOneRecord']['hasOne']['child']['relationFn'].toString()
      ).not.toEqual('');
    });
  });

  describe(`[static] hasMany`, () => {
    class TestHasManyRecord extends Record {
      public id: t.PrimaryKey;
      public children: t.HasMany<TestHasManyChildRecod>;

      get uniqueKey(): string {
        return 'TestHasManyRecord';
      }
    }

    class TestHasManyChildRecod extends Record {
      public id: t.PrimaryKey;

      get uniqueKey(): string {
        return 'TestHasManyChildRecod';
      }
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
