import { Support } from '@/supports';

describe('Support(Info)', () => {
  describe('[static] getMethods', () => {
    class TestGetMethods extends Support {
      public name: string;
      private age: number;

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
      expect(TestGetMethods.getMethods()).toEqual(['create', 'update', 'read', 'destroy']);
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
});
