import { ActiveModel$Base } from '../base';
import { registryForValidations as Registry } from '@/registries';
import { RueCheck } from '@/decorators';

// types
import type * as rt from '@/registries';

class Model extends ActiveModel$Base {}

describe('ActiveModel$Base (ActiveModel$Validations)', () => {
  describe('constructor', () => {
    const instance = new Model();
    it('return correctly', () => {
      expect(instance.errors).toEqual({});
    });
  });

  describe('[static] translate', () => {
    describe('when default', () => {
      it('return correctly', () => {
        expect(Model.translate('propKey', {})).toEqual('propKey');
      });
    });
  });

  describe('[static] validates', () => {
    class TestValidatesModel extends Model {
      public name: string;

      get uniqueKey() {
        return 'TestValidatesModel';
      }

      constructor() {
        super();
        this.name = 'name';
      }
    }
    TestValidatesModel.validates('name', { presence: true, length: { is: 4 } });
    it('should return correctly', () => {
      expect(Registry.read<rt.ValidationFn[]>('TestValidatesModel', 'name').length).toEqual(2);
    });
  });

  describe('#isValid', () => {
    describe('when default', () => {
      class IsValidModel extends Model {
        get uniqueKey(): string {
          return 'IsValidModel';
        }
      }

      const instance = new IsValidModel();

      it('return true', () => {
        const result = instance.isValid();
        expect(result).toEqual(true);
        expect(instance.errors).toEqual({});
      });
    });

    describe('when override inherited class', () => {
      describe('when return true', () => {
        @RueCheck()
        class TestIsValidSkillModel extends Model {
          public name: string;
          public year: number;

          get uniqueKey(): string {
            return 'TestIsValidSkillModel';
          }

          constructor(data?: { name: string; year: number }) {
            super(data);
            this.name = data['name'];
            this.year = data['year'];
          }
        }

        // register Model
        TestIsValidSkillModel.validates('name', { presence: true });
        TestIsValidSkillModel.validates('year', {
          presence: true,
          numericality: { onlyInteger: true },
        });

        @RueCheck()
        class TestIsValidModel extends Model {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: TestIsValidSkillModel[];

          get uniqueKey(): string {
            return 'TestIsValidModel';
          }

          constructor() {
            super();
            this.profile = {
              name: 'dhh you',
              year: 20,
              sex: 'man',
              email: 'test@example.com',
            };
            this.ipv4 = '191.255.255.255';
            this.ipv6 = '2001:0db8:1234:5678:90ab:cdef:0000:0000';
            this.tags = 'rails,vue,typescript';
            this.skills = [
              new TestIsValidSkillModel({ name: 'ruby', year: 5 }),
              new TestIsValidSkillModel({ name: 'javascript', year: 4 }),
              new TestIsValidSkillModel({ name: 'typescript', year: 3 }),
              new TestIsValidSkillModel({ name: 'vue', year: 3 }),
            ];
          }
        }

        // register Model
        TestIsValidModel.validates('profile.name', { presence: true });
        TestIsValidModel.validates('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
        });
        TestIsValidModel.validates('profile.sex', { inclusion: { in: ['man', 'weman'] } });
        TestIsValidModel.validates('profile.email', { format: { with: 'email' } });
        TestIsValidModel.validates('ipv4', { format: { with: 'IPv4' } });
        TestIsValidModel.validates('ipv6', { format: { with: 'IPv6' } });
        TestIsValidModel.validates('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(',') },
        });
        TestIsValidModel.validates<TestIsValidSkillModel[]>('skills', {
          condition: [
            'valid all skills or not',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
        });

        const instance = new TestIsValidModel();

        it('return true', () => {
          const result = instance.isValid();
          expect(result).toEqual(true);
          expect(instance.errors['profile']['name']).toEqual([]);
          expect(instance.errors['profile']['year']).toEqual([]);
          expect(instance.errors['profile']['sex']).toEqual([]);
          expect(instance.errors['profile']['email']).toEqual([]);
          expect(instance.errors['ipv4']).toEqual([]);
          expect(instance.errors['ipv6']).toEqual([]);
          expect(instance.errors['skills']).toEqual([]);
        });
      });

      describe('when return errors', () => {
        @RueCheck()
        class TestIsValidErrorsSkillModel extends Model {
          public name: string;
          public year: number;

          get uniqueKey(): string {
            return 'TestIsValidErrorsSkillModel';
          }

          constructor(data?: { name: string; year: number }) {
            super(data);
            this.name = data['name'];
            this.year = data['year'];
          }
        }

        // register Model
        TestIsValidErrorsSkillModel.validates('name', { presence: true });
        TestIsValidErrorsSkillModel.validates('year', {
          presence: true,
          numericality: { onlyInteger: true },
        });

        @RueCheck()
        class TestIsValidErrorsModel extends Model {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: TestIsValidErrorsSkillModel[];

          get uniqueKey(): string {
            return 'TestIsValidErrorsModel';
          }

          constructor() {
            super();
            this.profile = {
              name: undefined,
              year: 0.1,
              sex: 'unknown',
              email: 'email address',
            };
            this.ipv4 = '123456789';
            this.ipv6 = '1234567890';
            this.tags = 'rails,vue,typescript,react';
            this.skills = [
              new TestIsValidErrorsSkillModel({ name: undefined, year: 0.4 }),
              new TestIsValidErrorsSkillModel({ name: null, year: 0.3 }),
            ];
          }
        }

        // register Model
        TestIsValidErrorsModel.validates('profile.name', { presence: true });
        TestIsValidErrorsModel.validates('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
        });
        TestIsValidErrorsModel.validates('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
        });
        TestIsValidErrorsModel.validates('profile.email', {
          format: { with: 'email' },
          length: { maximum: 1 },
        });
        TestIsValidErrorsModel.validates('ipv4', { format: { with: 'IPv4' } });
        TestIsValidErrorsModel.validates('ipv6', { format: { with: 'IPv6' } });
        TestIsValidErrorsModel.validates('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(','), is: 1 },
        });
        TestIsValidErrorsModel.validates<TestIsValidErrorsSkillModel[]>('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
        });

        const instance = new TestIsValidErrorsModel();

        it('return errors', () => {
          const result = instance.isValid();
          expect(result).toEqual(false);
          expect(instance.errors['profile']['name'][0].message).toEqual(
            "'models.TestIsValidErrorsModel.profile.name' can't be empty."
          );
          expect(instance.errors['profile']['year'][0].message).toEqual(
            "'models.TestIsValidErrorsModel.profile.year' is not only integer."
          );
          expect(instance.errors['profile']['sex'][0].message).toEqual(
            '\'models.TestIsValidErrorsModel.profile.sex\' is not included in the \'["man","weman"]\'.'
          );
          expect(instance.errors['profile']['email'][0].message).toEqual(
            "'models.TestIsValidErrorsModel.profile.email' is too long (maximum '1' characters)."
          );
          expect(instance.errors['profile']['email'][1].message).toEqual(
            "'models.TestIsValidErrorsModel.profile.email' do not meet the format: 'email'."
          );
          expect(instance.errors['ipv4'][0].message).toEqual(
            "'models.TestIsValidErrorsModel.ipv4' do not meet the format: 'IPv4'."
          );
          expect(instance.errors['ipv6'][0].message).toEqual(
            "'models.TestIsValidErrorsModel.ipv6' do not meet the format: 'IPv6'."
          );
          expect(instance.errors['tags'][0].message).toEqual(
            "'models.TestIsValidErrorsModel.tags' is too long (maximum '3' words)."
          );
          expect(instance.errors['tags'][1].message).toEqual(
            "'models.TestIsValidErrorsModel.tags' is not equal length ('1' characters)."
          );
          expect(instance.errors['skills'][0].message).toEqual(
            "'models.TestIsValidErrorsModel.skills' do not meet the condition: 'valid all skills'."
          );
          expect(instance.skills[0].errors['name'][0].message).toEqual(
            "'models.TestIsValidErrorsSkillModel.name' can't be empty."
          );
          expect(instance.skills[0].errors['year'][0].message).toEqual(
            "'models.TestIsValidErrorsSkillModel.year' is not only integer."
          );
          expect(instance.skills[1].errors['name'][0].message).toEqual(
            "'models.TestIsValidErrorsSkillModel.name' can't be empty."
          );
          expect(instance.skills[1].errors['year'][0].message).toEqual(
            "'models.TestIsValidErrorsSkillModel.year' is not only integer."
          );
        });
      });

      describe('when skip (using if)', () => {
        @RueCheck()
        class TestIsValidSkipSkillModel extends Model {
          public name: string;
          public year: number;

          get uniqueKey(): string {
            return 'TestIsValidSkipSkillModel';
          }

          constructor(data?: { name: string; year: number }) {
            super(data);
            this.name = data['name'];
            this.year = data['year'];
          }
        }

        // register Model
        TestIsValidSkipSkillModel.validates<string>('name', {
          presence: true,
          if: (propVal, self) => propVal == '',
        });
        TestIsValidSkipSkillModel.validates<number>('year', {
          presence: true,
          numericality: { onlyInteger: true },
          if: (propVal, self) => propVal == 0,
        });

        class TestIsValidSkipModel extends Model {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: TestIsValidSkipSkillModel[];

          get uniqueKey(): string {
            return 'TestIsValidSkipModel';
          }

          constructor() {
            super();
            this.profile = {
              name: '',
              year: 0.1,
              sex: 'unknown',
              email: 'email address',
            };
            this.ipv4 = '123456789';
            this.ipv6 = '1234567890';
            this.tags = 'rails,vue,typescript,react';
            this.skills = [
              new TestIsValidSkipSkillModel({ name: undefined, year: 0.4 }),
              new TestIsValidSkipSkillModel({ name: null, year: 0.3 }),
            ];
          }
        }

        // register Model
        TestIsValidSkipModel.validates<string>('profile.name', {
          presence: true,
          if: (propVal, self) => propVal == 'dhh',
        });
        TestIsValidSkipModel.validates<number>('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
          if: (propVal, self) => propVal == 0,
        });
        TestIsValidSkipModel.validates<string>('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
          if: (propVal, self) => propVal == 'unknownn',
        });
        TestIsValidSkipModel.validates<string>('profile.email', {
          format: { with: 'email' },
          if: (propVal, self) => propVal.startsWith('test'),
        });
        TestIsValidSkipModel.validates<string>('ipv4', {
          format: { with: 'IPv4' },
          if: (propVal, self) => propVal == '',
        });
        TestIsValidSkipModel.validates<string>('ipv6', {
          format: { with: 'IPv6' },
          if: (propVal, self) => propVal == '',
        });
        TestIsValidSkipModel.validates<string>('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(',') },
          if: (propVal, self) => propVal == '',
        });
        TestIsValidSkipModel.validates<TestIsValidSkipSkillModel[]>('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
          if: (propVal, self) => propVal == [],
        });

        const instance = new TestIsValidSkipModel();

        it('should skip', () => {
          const result = instance.isValid();
          expect(result).toEqual(true);
          expect(instance.errors['profile']['name']).toEqual([]);
          expect(instance.errors['profile']['year']).toEqual([]);
          expect(instance.errors['profile']['sex']).toEqual([]);
          expect(instance.errors['profile']['email']).toEqual([]);
          expect(instance.errors['ipv4']).toEqual([]);
          expect(instance.errors['ipv6']).toEqual([]);
          expect(instance.errors['tags']).toEqual([]);
          expect(instance.errors['skills']).toEqual([]);
          expect(instance.skills[0].errors).toEqual({});
          expect(instance.skills[1].errors).toEqual({});
        });
      });

      describe('when skip (allow_null/allow_blank/allow_undefined)', () => {
        class TestIsValidAllowSkillModel extends Model {
          public name: string;
          public year: number;

          get uniqueKey(): string {
            return 'TestIsValidAllowSkillModel';
          }

          constructor(data?: { name: string; year: number }) {
            super(data);
            this.name = data['name'];
            this.year = data['year'];
          }
        }

        // register Model
        TestIsValidAllowSkillModel.validates<string>('name', {
          presence: true,
          allow_null: true,
          allow_undefined: true,
        });
        TestIsValidAllowSkillModel.validates<number>('year', {
          presence: true,
          numericality: { onlyInteger: true },
          allow_null: true,
        });

        class TestIsValidAllowModel extends Model {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: TestIsValidAllowSkillModel[];

          get uniqueKey(): string {
            return 'TestIsValidAllowModel';
          }

          constructor() {
            super();
            this.profile = {
              name: '',
              year: null,
              sex: undefined,
              email: '',
            };
            this.ipv4 = null;
            this.ipv6 = undefined;
            this.tags = '';
            this.skills = [
              new TestIsValidAllowSkillModel({ name: undefined, year: undefined }),
              new TestIsValidAllowSkillModel({ name: null, year: null }),
            ];
          }
        }

        // register Model
        TestIsValidAllowModel.validates<string>('profile.name', {
          presence: true,
          allow_blank: true,
        });
        TestIsValidAllowModel.validates<number>('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
          allow_null: true,
        });
        TestIsValidAllowModel.validates<string>('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
          allow_undefined: true,
        });
        TestIsValidAllowModel.validates<string>('profile.email', {
          format: { with: 'email' },
          allow_blank: true,
        });
        TestIsValidAllowModel.validates<string>('ipv4', {
          format: { with: 'IPv4' },
          allow_null: true,
        });
        TestIsValidAllowModel.validates<string>('ipv6', {
          format: { with: 'IPv6' },
          allow_undefined: true,
        });
        TestIsValidAllowModel.validates<string>('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(',') },
          allow_blank: true,
        });
        TestIsValidAllowModel.validates<TestIsValidAllowSkillModel[]>('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
        });

        const instance = new TestIsValidAllowModel();

        it('should skip', () => {
          const result = instance.isValid();
          expect(result).toEqual(true);
          expect(instance.errors['profile']['name']).toEqual([]);
          expect(instance.errors['profile']['year']).toEqual([]);
          expect(instance.errors['profile']['sex']).toEqual([]);
          expect(instance.errors['profile']['email']).toEqual([]);
          expect(instance.errors['ipv4']).toEqual([]);
          expect(instance.errors['ipv6']).toEqual([]);
          expect(instance.errors['tags']).toEqual([]);
          expect(instance.errors['skills']).toEqual([]);
          expect(instance.skills[0].errors['name']).toEqual([]);
          expect(instance.skills[0].errors['year']).toEqual([]);
          expect(instance.skills[1].errors['name']).toEqual([]);
          expect(instance.skills[1].errors['year']).toEqual([]);
        });
      });

      describe('when return errors (override message fn)', () => {
        class TestIsValidOverrideMsgSkillModel extends Model {
          public name: string;
          public year: number;

          get uniqueKey(): string {
            return 'TestIsValidOverrideMsgSkillModel';
          }

          constructor(data?: { name: string; year: number }) {
            super(data);
            this.name = data['name'];
            this.year = data['year'];
          }
        }

        // register Model
        TestIsValidOverrideMsgSkillModel.validates('name', {
          presence: true,
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgSkillModel.validates('year', {
          presence: true,
          numericality: { onlyInteger: true },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });

        class TestIsValidOverrideMsgModel extends Model {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: TestIsValidOverrideMsgSkillModel[];

          get uniqueKey(): string {
            return 'TestIsValidOverrideMsgModel';
          }

          constructor() {
            super();
            this.profile = {
              name: undefined,
              year: 0.1,
              sex: 'unknown',
              email: 'email address',
            };
            this.ipv4 = '123456789';
            this.ipv6 = '1234567890';
            this.tags = 'rails,vue,typescript,react';
            this.skills = [
              new TestIsValidOverrideMsgSkillModel({ name: undefined, year: 0.4 }),
              new TestIsValidOverrideMsgSkillModel({ name: null, year: 0.3 }),
            ];
          }
        }

        // register Model
        TestIsValidOverrideMsgModel.validates('profile.name', {
          presence: true,
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgModel.validates('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgModel.validates('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgModel.validates('profile.email', {
          format: { with: 'email' },
          length: { maximum: 1 },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgModel.validates('ipv4', {
          format: { with: 'IPv4' },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgModel.validates('ipv6', {
          format: { with: 'IPv6' },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgModel.validates('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(','), is: 1 },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgModel.validates<
          TestIsValidOverrideMsgSkillModel[],
          TestIsValidOverrideMsgModel
        >('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
          message: (tPropKey, propVal, self) =>
            `${tPropKey}|${JSON.stringify(propVal)}|${self.profile.year}`,
        });

        const instance = new TestIsValidOverrideMsgModel();

        it('return errors', () => {
          const result = instance.isValid();
          expect(result).toEqual(false);
          expect(instance.errors['profile']['name'][0].message).toEqual(
            'models.TestIsValidOverrideMsgModel.profile.name|undefined'
          );
          expect(instance.errors['profile']['year'][0].message).toEqual(
            'models.TestIsValidOverrideMsgModel.profile.year|0.1'
          );
          expect(instance.errors['profile']['sex'][0].message).toEqual(
            'models.TestIsValidOverrideMsgModel.profile.sex|unknown'
          );
          expect(instance.errors['profile']['email'][0].message).toEqual(
            'models.TestIsValidOverrideMsgModel.profile.email|email address'
          );
          expect(instance.errors['profile']['email'][1].message).toEqual(
            'models.TestIsValidOverrideMsgModel.profile.email|email address'
          );
          expect(instance.errors['ipv4'][0].message).toEqual(
            'models.TestIsValidOverrideMsgModel.ipv4|123456789'
          );
          expect(instance.errors['ipv6'][0].message).toEqual(
            'models.TestIsValidOverrideMsgModel.ipv6|1234567890'
          );
          expect(instance.errors['tags'][0].message).toEqual(
            'models.TestIsValidOverrideMsgModel.tags|rails,vue,typescript,react'
          );
          expect(instance.errors['tags'][1].message).toEqual(
            'models.TestIsValidOverrideMsgModel.tags|rails,vue,typescript,react'
          );
          expect(instance.errors['skills'][0].message).toEqual(
            'models.TestIsValidOverrideMsgModel.skills|[{"errors":{},"year":0.4},{"errors":{},"name":null,"year":0.3}]|0.1'
          );
          expect(instance.skills[0].errors['name'][0].message).toEqual(
            'models.TestIsValidOverrideMsgSkillModel.name|undefined'
          );
          expect(instance.skills[0].errors['year'][0].message).toEqual(
            'models.TestIsValidOverrideMsgSkillModel.year|0.4'
          );
          expect(instance.skills[1].errors['name'][0].message).toEqual(
            'models.TestIsValidOverrideMsgSkillModel.name|null'
          );
          expect(instance.skills[1].errors['year'][0].message).toEqual(
            'models.TestIsValidOverrideMsgSkillModel.year|0.3'
          );
        });
      });
    });
  });
});
