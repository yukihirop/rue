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
          'ActiveSupport$Info (RueModule)',
          'ActiveSupport$ImplBase',
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
          'ActiveSupport$Info (RueModule)',
          'ActiveSupport$ImplBase',
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
          'ActiveSupport$Info (RueModule)',
          'ActiveSupport$ImplBase',
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
          'test.ActiveSupport$Info',
          'test.ActiveSupport$ImplBase',
          'test.',
          'test.undefined',
        ]);
      });
    });
  });
});
