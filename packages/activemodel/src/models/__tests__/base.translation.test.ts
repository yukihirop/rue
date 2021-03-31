// locals
import { ActiveModel$Base } from '../base';

class Model extends ActiveModel$Base {}

describe('ActiveModel$Base (ActiveModel$Translation)', () => {
  describe('[static] translate', () => {
    describe('when default', () => {
      class TranslateModel extends Model {
        get uniqueKey(): string {
          return 'TranslateModel';
        }
      }

      it('should correctly', () => {
        expect(TranslateModel.translate('test')).toEqual('test');
      });
    });

    describe('when override', () => {
      class TranslateModel extends Model {
        get uniqueKey(): string {
          return 'TranslateModel';
        }
      }
      it('should correctly', () => {
        expect(TranslateModel.translate('test')).toEqual('test');
      });
    });
  });

  describe('#humanPropertyName(alias to #humanPropName)', () => {
    type TestHumanPropertyNameParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestHumanPropertyNameModel extends Model {
      public profile?: TestHumanPropertyNameParams['profile'];

      get uniqueKey(): string {
        return 'TestHumanPropertyNameModel';
      }
    }

    const model = new TestHumanPropertyNameModel({ profile: { name: 'name_4', age: 4 } });

    it('should correctly', () => {
      expect(model.humanPropertyName('profile.name')).toEqual(
        'models.TestHumanPropertyNameModel.profile.name'
      );
      expect(model.humanPropName('profile.age')).toEqual(
        'models.TestHumanPropertyNameModel.profile.age'
      );
    });
  });
});
