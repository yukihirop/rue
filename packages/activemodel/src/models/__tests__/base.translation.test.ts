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

  describe('[static] $t (alias to #humanPropertyName / #humanPropName / #humanAttributeName)', () => {
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

    describe('when default', () => {
      it('should correctly', () => {
        expect(TestHumanPropertyNameModel.$t('profile.name')).toEqual(
          'models.TestHumanPropertyNameModel.profile.name'
        );
        expect(TestHumanPropertyNameModel.humanPropertyName('profile.name')).toEqual(
          'models.TestHumanPropertyNameModel.profile.name'
        );
        expect(TestHumanPropertyNameModel.humanPropName('profile.age')).toEqual(
          'models.TestHumanPropertyNameModel.profile.age'
        );
        expect(TestHumanPropertyNameModel.humanAttributeName('profile.age')).toEqual(
          'models.TestHumanPropertyNameModel.profile.age'
        );
      });
    });

    describe('when enum', () => {
      it('should correctly', () => {
        expect(TestHumanPropertyNameModel.$t('/status.wip')).toEqual(
          'models.TestHumanPropertyNameModel/status.wip'
        );
        expect(TestHumanPropertyNameModel.humanPropertyName('/status.wip')).toEqual(
          'models.TestHumanPropertyNameModel/status.wip'
        );
        expect(TestHumanPropertyNameModel.humanPropName('/status.wip')).toEqual(
          'models.TestHumanPropertyNameModel/status.wip'
        );
        expect(TestHumanPropertyNameModel.humanAttributeName('/status.wip')).toEqual(
          'models.TestHumanPropertyNameModel/status.wip'
        );
      });
    });
  });

  describe('#$t (alias to #humanPropertyName / #humanPropName / #humanAttributeName)', () => {
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

    describe('when default', () => {
      it('should correctly', () => {
        expect(model.$t('profile.name')).toEqual('models.TestHumanPropertyNameModel.profile.name');
        expect(model.humanPropertyName('profile.name')).toEqual(
          'models.TestHumanPropertyNameModel.profile.name'
        );
        expect(model.humanPropName('profile.age')).toEqual(
          'models.TestHumanPropertyNameModel.profile.age'
        );
        expect(model.humanAttributeName('profile.age')).toEqual(
          'models.TestHumanPropertyNameModel.profile.age'
        );
      });
    });

    describe('when enum', () => {
      it('should correctly', () => {
        expect(model.$t('/status.wip')).toEqual('models.TestHumanPropertyNameModel/status.wip');
        expect(model.humanPropertyName('/status.wip')).toEqual(
          'models.TestHumanPropertyNameModel/status.wip'
        );
        expect(model.humanPropName('/status.wip')).toEqual(
          'models.TestHumanPropertyNameModel/status.wip'
        );
        expect(model.humanAttributeName('/status.wip')).toEqual(
          'models.TestHumanPropertyNameModel/status.wip'
        );
      });
    });
  });
});
