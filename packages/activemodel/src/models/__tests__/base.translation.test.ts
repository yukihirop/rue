// locals
import { ActiveModel$Base as Model } from '../base';

describe('ActiveModel$Base (ActiveModel$Translation)', () => {
  describe('[static] translate', () => {
    describe('when default (throw error)', () => {
      class TranslateModel extends Model {
        get uniqueKey(): string {
          return 'TranslateModel';
        }
      }

      it('should correctly', () => {
        expect(() => {
          TranslateModel.translate('test');
        }).toThrowError(
          "Please implement '[static] translate(key: string, opts?: any): string' in Inherited Class."
        );
      });
    });

    describe('when override', () => {
      class TranslateModel extends Model {
        static translate(key: string, opts?: any): string {
          return key;
        }

        get uniqueKey(): string {
          return 'TranslateModel';
        }
      }
      it('should correctly', () => {
        expect(TranslateModel.translate('test')).toEqual('test');
      });
    });
  });

  describe('[static] checkTranslate', () => {
    describe('when default (throw error)', () => {
      class CheckTranslateModel extends Model {
        get uniqueKey(): string {
          return 'CheckTranslateModel';
        }
      }

      it('should correctly', () => {
        expect(() => {
          // @ts-expect-error
          CheckTranslateModel.checkTranslate();
        }).toThrowError(
          "Please implement '[static] translate(key: string, opts?: any): string' in Inherited Class."
        );
      });
    });

    describe('when override (return true)', () => {
      class CheckTranslateModel extends Model {
        static translate(key: string, opts?: any): string {
          return key;
        }

        get uniqueKey(): string {
          return 'CheckTranslateModel';
        }
      }
      it('should correctly', () => {
        // @ts-expect-error
        expect(CheckTranslateModel.checkTranslate()).toEqual(true);
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

      static translate(key: string, opts?: any): string {
        return `test.${key}`;
      }

      get uniqueKey(): string {
        return 'TestHumanPropertyNameModel';
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
