// locals
import { ActiveModel$Base } from '../base';

// types
import type * as lt from '@/locales';

class Model extends ActiveModel$Base {
  static i18nConfig(): lt.I18nConfig {
    return {
      options: {
        lng: 'ja',
      },
      resources: {
        ja: {},
      },
    };
  }
}

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

  describe('[static] checkI18nConfig', () => {
    describe('when default (throw error)', () => {
      class CheckTranslateModel extends ActiveModel$Base {
        get uniqueKey(): string {
          return 'CheckTranslateModel';
        }
      }
      it('should correctly', () => {
        expect(() => {
          // @ts-expect-error
          CheckTranslateModel.checkI18nConfig();
        }).toThrowError(
          "Please implement 'static i18nConfig(): lt.I18nConfig' in Inherited Class."
        );
      });
    });
    describe('when override (return true)', () => {
      class CheckTranslateModel extends Model {
        get uniqueKey(): string {
          return 'CheckTranslateModel';
        }
      }

      it('should correctly', () => {
        // @ts-expect-error
        expect(CheckTranslateModel.checkI18nConfig()).toEqual(true);
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
