// classes
import { ActiveRecord$Associations$Base as Association } from '../base';
import { registryForScopes as Registry } from '@/registries';

// types
import type * as t from '../index';

describe('Association(CollectionProxy)', () => {
  describe('[static] scope', () => {
    class TestScopeAssociation extends Association {
      static scopeName: t.Association$Scope<TestScopeAssociation>;
    }

    TestScopeAssociation.scope<any>('scopeName', () => Promise.resolve([1, 2, 3]));

    it('should correctly', () => {
      expect(Registry.data['TestScopeAssociation']['scope']['scopeName'].toString()).toEqual(
        '() => Promise.resolve([1, 2, 3])'
      );
    });
  });
});
