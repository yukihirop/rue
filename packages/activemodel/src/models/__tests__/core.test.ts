// locals
import { Core as Model } from '../core';
import { registryForTranslator as Registry } from '@/registries';

describe('Model', () => {
  describe('constructor', () => {
    class Test1Model extends Model {
      public name: string;
      public age: number;
    }

    describe('when data is empty', () => {
      const model = new Test1Model();
      it('should correctly', () => {
        expect(model.errors).toEqual({});
      });
    });

    describe('when data is not empty', () => {
      const model = new Test1Model({ name: 'name', age: 20 });
      it('should correctly', () => {
        expect(model.errors).toEqual({});
        expect(model.name).toEqual('name');
        expect(model.age).toEqual(20);
      });
    });
  });

  describe('[static] loadTranslator', () => {
    class Test2Model extends Model {
      public name: string;
      public age: number;

      static translate(key: string, opts?: any): string {
        return `test.${key}`;
      }
    }

    it('should correctly', () => {
      expect(Registry.data['Test2Model']).toEqual(undefined);
      Test2Model.loadTranslator();
      expect(Registry.data['ActiveModel']['translate'].toString()).not.toEqual('');
    });
  });

  describe('#toObj', () => {
    type Test7Params = {
      profile: {
        name: string;
        age: number;
      };
    };
    class Test3Model extends Model {
      public profile?: Test7Params['profile'];
    }

    const model = new Test3Model({ profile: { name: 'name_3', age: 3 } });

    describe("when specify 'flat' is 'false' (default)", () => {
      it('should correctly', () => {
        expect(model.toObj()).toEqual({ errors: {}, profile: { name: 'name_3', age: 3 } });
      });
    });

    describe("when specify 'flat' is 'true'", () => {
      it('should correctly', () => {
        expect(model.toObj({ flat: true })).toEqual({
          errors: {},
          'profile.name': 'name_3',
          'profile.age': 3,
        });
      });
    });
  });
});
