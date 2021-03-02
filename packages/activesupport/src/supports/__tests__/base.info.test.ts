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

    it('should correctly', () => {
      expect(TestGetMethodsWithNamespace.getMethodsWithNamespace()).toEqual({
        ActiveSupport$Base: ['inspect'],
        ActiveSupport$Impl: [],
        'ActiveSupport$Info (RueModule)': [
          'getMethodsWithNamespace',
          'getProperties',
          'getAncestors',
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
    describe('when default', () => {
      class TestGetAncestors extends Support {}

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

    describe('when complex', () => {
      // ActiveModel
      class ActiveModel$Validations extends RueModule {}
      class ActiveModel$Translation extends RueModule {}
      class ActiveModel$Impl {
        static __rue_abstract_class__ = true;
      }
      ActiveModel$Translation.rueModuleIncludedFrom(ActiveModel$Impl, { only: [] });
      ActiveModel$Validations.rueModuleIncludedFrom(ActiveModel$Impl, { only: [] });
      class ActiveModel$Base extends ActiveModel$Impl {}

      // ActiveRecord
      class ActiveRecord$FinderMethods extends RueModule {}
      class ActiveRecord$Associations$CollectionProxy extends RueModule {}
      class ActiveRecord$Associations$Impl extends RueModule {
        static __rue_abstract_class__ = true;
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
        static __rue_abstract_class__ = true;
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
});
