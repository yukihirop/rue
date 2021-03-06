import { RueModule } from '@/modules';
import { ActiveSupport$Base as Support } from '@/supports';

describe('Support(Info)', () => {
  describe('[static] getMethodsWithNamespace', () => {
    class TestGetMethodsWithNamespaceChild extends Support {
      createChild() {
        return 'create';
      }
      updateChild() {
        return 'update';
      }
      readChild() {
        return 'read';
      }
      destroyChild() {
        return 'destroy';
      }
    }

    class TestGetMethodsWithNamespace extends TestGetMethodsWithNamespaceChild {
      create() {
        return 'create';
      }
      update() {
        return 'update';
      }
      read() {
        return 'read';
      }
      destroy() {
        return 'destroy';
      }
    }

    describe('when default', () => {
      it('should correctly', () => {
        expect(TestGetMethodsWithNamespace.getMethodsWithNamespace()).toEqual({
          ActiveSupport$Base: ['inspect'],
          ActiveSupport$Impl: [],
          'ActiveSupport$Info (RueModule)': [
            'getMethodsWithNamespace',
            'getProperties',
            'getAncestors',
            'getOwnerFrom',
          ],
          ActiveSupport$ImplBase: [],
          Function: ['apply', 'bind', 'call', 'toString'],
          Object: [
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'toString',
            'valueOf',
            'toLocaleString',
          ],
          TestGetMethodsWithNamespace: [],
          TestGetMethodsWithNamespaceChild: [],
        });
      });
    });

    describe("when specify 'obj'", () => {
      describe('when static methods', () => {
        it('should correctly', () => {
          expect(Support.getMethodsWithNamespace(TestGetMethodsWithNamespace)).toEqual({
            ActiveSupport$Base: ['inspect'],
            ActiveSupport$Impl: [],
            ActiveSupport$ImplBase: [],
            'ActiveSupport$Info (RueModule)': [
              'getMethodsWithNamespace',
              'getProperties',
              'getAncestors',
              'getOwnerFrom',
            ],
            Function: ['apply', 'bind', 'call', 'toString'],
            Object: [
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'toString',
              'valueOf',
              'toLocaleString',
            ],
            TestGetMethodsWithNamespace: [],
            TestGetMethodsWithNamespaceChild: [],
          });
        });
      });

      describe('when prototype methods', () => {
        it('should correctly', () => {
          expect(Support.getMethodsWithNamespace(TestGetMethodsWithNamespace.prototype)).toEqual({
            ActiveSupport$Base: [],
            ActiveSupport$Impl: [],
            ActiveSupport$ImplBase: [],
            'ActiveSupport$Info (RueModule)': [],
            Function: ['prototype'],
            Object: [
              'assign',
              'getOwnPropertyDescriptor',
              'getOwnPropertyDescriptors',
              'getOwnPropertyNames',
              'getOwnPropertySymbols',
              'is',
              'preventExtensions',
              'seal',
              'create',
              'defineProperties',
              'defineProperty',
              'freeze',
              'getPrototypeOf',
              'setPrototypeOf',
              'isExtensible',
              'isFrozen',
              'isSealed',
              'keys',
              'entries',
              'values',
              'fromEntries',
            ],
            TestGetMethodsWithNamespace: ['create', 'update', 'read', 'destroy'],
            TestGetMethodsWithNamespaceChild: [
              'createChild',
              'updateChild',
              'readChild',
              'destroyChild',
            ],
          });
        });
      });
    });
  });

  describe('[static] getProperties', () => {
    describe('when do not initialize in constructor', () => {
      class TestGetProperties extends Support {
        public name: string;
        public age: string;
        private sex: 'man' | 'woman' | 'unknown';

        create() {
          return 'create';
        }
        update() {
          return 'update';
        }
        read() {
          return 'read';
        }
        destroy() {
          return 'destroy';
        }
      }

      it('should correctly', () => {
        expect(TestGetProperties.getProperties()).toEqual([]);
      });
    });

    describe('when initialize in constructor', () => {
      class TestGetPropertiesInitialized extends Support {
        public name: string;
        public age: string;
        private sex: 'man' | 'woman' | 'unknown';

        constructor() {
          super();
          this.name = undefined;
          this.age = undefined;
          this.sex = 'man';
        }

        create() {
          return 'create';
        }
        update() {
          return 'update';
        }
        read() {
          return 'read';
        }
        destroy() {
          return 'destroy';
        }
      }

      it('should correctly', () => {
        expect(TestGetPropertiesInitialized.getProperties()).toEqual(['name', 'age', 'sex']);
      });
    });
  });

  describe('[static] getAncestors', () => {
    class TestGetAncestors extends Support {}

    describe('when default', () => {
      it('should correctly', () => {
        expect(TestGetAncestors.getAncestors()).toEqual([
          'TestGetAncestors',
          'ActiveSupport$Base',
          'ActiveSupport$Impl',
          'ActiveSupport$ImplBase',
          'ActiveSupport$Info (RueModule)',
          'Function',
          'Object',
        ]);
      });
    });

    describe('when give args (Function)', () => {
      it('should correctly', () => {
        expect(Support.getAncestors(Support)).toEqual([
          'ActiveSupport$Base',
          'ActiveSupport$Impl',
          'ActiveSupport$ImplBase',
          'ActiveSupport$Info (RueModule)',
          'Function',
          'Object',
        ]);
      });
    });

    describe('when give args (object)', () => {
      it('should correctly', () => {
        expect(Support.getAncestors(new Support())).toEqual([
          'ActiveSupport$Base',
          'ActiveSupport$Impl',
          'ActiveSupport$ImplBase',
          'ActiveSupport$Info (RueModule)',
          'Function',
          'Object',
        ]);
      });
    });

    describe('when give transformer', () => {
      it('should correctly', () => {
        expect(Support.getAncestors(undefined, (obj) => `test.${obj['name']}`)).toEqual([
          'test.ActiveSupport$Base',
          'test.ActiveSupport$Impl',
          'test.ActiveSupport$ImplBase',
          'test.ActiveSupport$Info',
          'test.',
          'test.undefined',
        ]);
      });
    });

    describe('when give prototype', () => {
      it('should correctly', () => {
        expect(Support.getAncestors(TestGetAncestors.prototype.constructor)).toEqual([
          'TestGetAncestors',
          'ActiveSupport$Base',
          'ActiveSupport$Impl',
          'ActiveSupport$ImplBase',
          'ActiveSupport$Info (RueModule)',
          'Function',
          'Object',
        ]);
      });
    });

    describe('when complex', () => {
      // ActiveModel
      class ActiveModel$Validations extends RueModule {}
      class ActiveModel$Translation extends RueModule {}
      class ActiveModel$Impl {
        static __rue_impl_class__ = true;
      }
      ActiveModel$Translation.rueModuleIncludedFrom(ActiveModel$Impl, { only: [] });
      ActiveModel$Validations.rueModuleIncludedFrom(ActiveModel$Impl, { only: [] });
      class ActiveModel$Base extends ActiveModel$Impl {}

      // ActiveRecord
      class ActiveRecord$FinderMethods extends RueModule {}
      class ActiveRecord$Associations$CollectionProxy extends RueModule {}
      class ActiveRecord$Associations$Impl extends RueModule {
        static __rue_impl_class__ = true;
      }
      ActiveRecord$Associations$CollectionProxy.rueModuleExtendedFrom(
        ActiveRecord$Associations$Impl,
        {
          only: [],
        }
      );
      // RueModule include RueModule pattern
      class ActiveRecord$Associations extends ActiveRecord$Associations$Impl {}
      class ActiveRecord$Persistence extends RueModule {}
      class ActiveRecord$Impl extends ActiveModel$Base {
        static __rue_impl_class__ = true;
      }
      ActiveRecord$Persistence.rueModuleIncludedFrom(ActiveRecord$Impl, { only: [] });
      ActiveRecord$Associations.rueModuleIncludedFrom(ActiveRecord$Impl, { only: [] });
      ActiveRecord$Persistence.rueModuleExtendedFrom(ActiveRecord$Impl, { only: [] });
      ActiveRecord$FinderMethods.rueModuleExtendedFrom(ActiveRecord$Impl, { only: [] });
      ActiveRecord$Associations.rueModuleExtendedFrom(ActiveRecord$Impl, { only: [] });
      class ActiveRecord$Base extends ActiveRecord$Impl {}
      class ActiveRecord extends ActiveRecord$Base {}
      it('should correctly', () => {
        expect(Support.getAncestors(ActiveRecord, (obj) => obj['name'])).toEqual([
          'ActiveRecord',
          'ActiveRecord$Base',
          'ActiveRecord$Impl',
          'ActiveModel$Base',
          'ActiveRecord$Persistence',
          'ActiveRecord$Associations',
          'ActiveRecord$Associations$Impl',
          'ActiveRecord$Associations$CollectionProxy',
          'ActiveRecord$FinderMethods',
          'ActiveModel$Impl',
          'ActiveModel$Translation',
          'ActiveModel$Validations',
          '',
          undefined,
        ]);
      });
    });
  });

  describe('getOwnerFrom', () => {
    describe('when static', () => {
      class GetOwnerFromRueModuleWhenStatic extends RueModule {
        static a() {
          return 'a';
        }
      }

      class GetOwnerFromWhenStatic$Impl {
        static __rue_impl_class__ = true;
        static a: () => string;
      }

      GetOwnerFromRueModuleWhenStatic.rueModuleExtendedFrom(GetOwnerFromWhenStatic$Impl, {
        only: ['a'],
      });

      class GetOwnerFrom extends GetOwnerFromWhenStatic$Impl {}

      it('should correctly', () => {
        expect(Support.getOwnerFrom(GetOwnerFrom, 'a')['name']).toEqual(
          'GetOwnerFromRueModuleWhenStatic'
        );
      });
    });

    describe('when instance', () => {
      class GetOwnerFromRueModuleWhenInstance extends RueModule {
        a() {
          return 'a';
        }
      }

      class GetOwnerFromWhenInstance$Impl {
        static __rue_impl_class__ = true;
        static a: () => string;
      }

      GetOwnerFromRueModuleWhenInstance.rueModuleIncludedFrom(GetOwnerFromWhenInstance$Impl, {
        only: ['a'],
      });

      class GetOwnerFrom extends GetOwnerFromWhenInstance$Impl {}

      it('should correctly', () => {
        expect(Support.getOwnerFrom(new GetOwnerFrom(), 'a')['name']).toEqual(
          'GetOwnerFromRueModuleWhenInstance'
        );
      });
    });
  });
});
