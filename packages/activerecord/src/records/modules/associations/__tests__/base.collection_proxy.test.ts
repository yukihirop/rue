// classes
import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Associations as AssociationsModule } from '../core';
import { registryForScopes as Registry } from '@/registries';

// types
import type * as aacpt from '../modules/collection_proxy';

describe('Association(CollectionProxy)', () => {
  describe('[static] scope', () => {
    class TestScopeAssociation extends ActiveRecord$Base {
      static scope: <T extends ActiveRecord$Base>(
        scopeName: string,
        fn: (...args) => aacpt.CollectionProxy$ScopeVal<T>
      ) => void;
      static scopeName: aacpt.CollectionProxy$Scope<TestScopeAssociation>;
    }

    AssociationsModule.rueModuleExtendedFrom(TestScopeAssociation, { only: ['scope'] });

    TestScopeAssociation.scope<any>('scopeName', (self) => self.where({ id: [1, 2, 3] }));

    it('should correctly', () => {
      expect(Registry.data['TestScopeAssociation']['scope']['scopeName'].toString()).toEqual(
        '(self) => self.where({ id: [1, 2, 3] })'
      );
    });
  });
});
