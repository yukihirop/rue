// locals
import { ActiveModel$Base as Model } from '../base';

describe('Model(Translation)', () => {
  describe('#humanPropertyName(alias to #humanPropName)', () => {
    type TestHumanPropertyNameParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestHumanPropertyNameModel extends Model {
      public profile?: TestHumanPropertyNameParams['profile'];

      static translate(key: string, opts?: any): string {
        return `test.${key}`;
      }
    }

    const model = new TestHumanPropertyNameModel({ profile: { name: 'name_4', age: 4 } });

    it('should correctly', () => {
      expect(model.humanPropertyName('profile.name')).toEqual(
        'test.rue.models.TestHumanPropertyNameModel.profile.name'
      );
      expect(model.humanPropName('profile.age')).toEqual(
        'test.rue.models.TestHumanPropertyNameModel.profile.age'
      );
    });
  });
});
