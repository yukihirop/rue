import { ActiveSupport$Registry$Core as Registry } from '../core';

type TestReigstryType = {
  profile: {
    name: string;
    age: number;
  };
  skills: string[];
  sex: 'man' | 'women' | 'unknown';
  flag: number;
};

class TestClass {}

const TestRegistry = new Registry<TestReigstryType>('TestRegistry');

describe('Registry(Singleton)', () => {
  afterEach(() => {
    TestRegistry.destroy(TestClass.name);
  });

  describe('constructor', () => {
    it('should correctly', () => {
      expect(TestRegistry.data).toEqual({});
      expect(TestRegistry.registryName).toEqual('TestRegistry');
    });
  });

  describe('#create', () => {
    describe("when 'object'", () => {
      it('should correctly', () => {
        TestRegistry.create(TestClass.name, 'profile', { name: 'name', age: 1 });
        expect(TestRegistry.data[TestClass.name]['profile']).toEqual({ age: 1, name: 'name' });
      });
    });

    describe("when 'array'", () => {
      it('should correctly', () => {
        TestRegistry.create(TestClass.name, 'skills', ['ruby', 'typescript', 'vue']);
        expect(TestRegistry.data[TestClass.name]['skills']).toEqual(['ruby', 'typescript', 'vue']);
      });
    });

    describe("when 'other[(e.g.) string | number]'", () => {
      it('should correctly', () => {
        TestRegistry.create(TestClass.name, 'sex', 'man');
        TestRegistry.create(TestClass.name, 'flag', 1);
        expect(TestRegistry.data[TestClass.name]['sex']).toEqual('man');
        expect(TestRegistry.data[TestClass.name]['flag']).toEqual(1);
      });
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      TestRegistry.create(TestClass.name, 'profile', { name: 'name', age: 1 });
      TestRegistry.create(TestClass.name, 'skills', ['ruby', 'typescript', 'vue']);
      TestRegistry.create(TestClass.name, 'sex', 'man');
      TestRegistry.create(TestClass.name, 'flag', 1);
    });

    describe("when 'object'", () => {
      it('should correctly', () => {
        TestRegistry.update(TestClass.name, 'profile', { name: 'update_name', age: 2 });
        expect(TestRegistry.data[TestClass.name]['profile']).toEqual({
          age: 2,
          name: 'update_name',
        });
      });
    });

    describe("when 'array'", () => {
      it('should correctly', () => {
        TestRegistry.update(TestClass.name, 'skills', ['rust', 'python', 'react']);
        expect(TestRegistry.data[TestClass.name]['skills']).toEqual(['rust', 'python', 'react']);
      });
    });

    describe("when 'other[(e.g.) string | number]'", () => {
      it('should correctly', () => {
        TestRegistry.update(TestClass.name, 'sex', 'woman');
        TestRegistry.update(TestClass.name, 'flag', 0);
        expect(TestRegistry.data[TestClass.name]['sex']).toEqual('woman');
        expect(TestRegistry.data[TestClass.name]['flag']).toEqual(0);
      });
    });
  });

  describe('#read', () => {
    describe('when default', () => {
      it('should correctly', () => {
        expect(TestRegistry.read(TestClass.name, 'profile')).toEqual(undefined);
        expect(TestRegistry.read(TestClass.name, 'skills')).toEqual(undefined);
        expect(TestRegistry.read(TestClass.name, 'sex')).toEqual(undefined);
        expect(TestRegistry.read(TestClass.name, 'flag')).toEqual(undefined);
      });
    });

    describe("when specify 'ensureType'", () => {
      it('should correctly', () => {
        expect(TestRegistry.read(TestClass.name, 'profile', 'object')).toEqual({});
        expect(TestRegistry.read(TestClass.name, 'skills', 'array')).toEqual([]);
        expect(TestRegistry.read(TestClass.name, 'sex')).toEqual(undefined);
        expect(TestRegistry.read(TestClass.name, 'flag')).toEqual(undefined);
      });
    });

    describe('when after create', () => {
      beforeEach(() => {
        TestRegistry.create(TestClass.name, 'profile', { name: 'name', age: 1 });
        TestRegistry.create(TestClass.name, 'skills', ['ruby', 'typescript', 'vue']);
        TestRegistry.create(TestClass.name, 'sex', 'man');
        TestRegistry.create(TestClass.name, 'flag', 1);
      });

      it('should correctly', () => {
        expect(TestRegistry.read(TestClass.name, 'profile')).toEqual({ age: 1, name: 'name' });
        expect(TestRegistry.read(TestClass.name, 'skills')).toEqual(['ruby', 'typescript', 'vue']);
        expect(TestRegistry.read(TestClass.name, 'sex')).toEqual('man');
        expect(TestRegistry.read(TestClass.name, 'flag')).toEqual(1);
      });
    });
  });

  describe('#destroy', () => {
    describe('when default', () => {
      it('should correctly', () => {
        TestRegistry.destroy(TestClass.name);
        expect(TestRegistry.data[TestClass.name]).toEqual({});
      });
    });
  });
});
