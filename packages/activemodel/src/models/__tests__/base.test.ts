// locals
import { ActiveModel$Base as Model } from '../base';

describe('Model', () => {
  describe('constructor', () => {
    class TestConstructorModel extends Model {
      public name: string;
      public age: number;
    }

    describe('when data is empty', () => {
      const model = new TestConstructorModel();
      it('should correctly', () => {
        expect(model.errors).toEqual({});
      });
    });

    describe('when data is not empty', () => {
      const model = new TestConstructorModel({ name: 'name', age: 20 });
      it('should correctly', () => {
        expect(model.errors).toEqual({});
        expect(model.name).toEqual('name');
        expect(model.age).toEqual(20);
      });
    });
  });

  describe('#toObj', () => {
    type TestToObjParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestToObjModel extends Model {
      public profile?: TestToObjParams['profile'];
    }

    const model = new TestToObjModel({ profile: { name: 'name_3', age: 3 } });

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
