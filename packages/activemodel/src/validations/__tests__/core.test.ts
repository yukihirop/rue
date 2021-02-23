import { ActiveModel$Validations$Core as Validations } from '../core';
import i18n from '@/locales';
import { registryForValidations as Registry } from '@/registries';

// types
import type * as t from '@/validations/types';
import type * as rt from '@/registries';

describe('Validations', () => {
  describe('constructor', () => {
    const instance = new Validations();
    it('return correctly', () => {
      expect(instance.errors).toEqual({});
    });
  });

  describe('[static] objType', () => {
    describe('when default', () => {
      it('return correctly', () => {
        expect(() => {
          Validations.objType();
        }).toThrow();
      });
    });

    describe('when override inherited class', () => {
      class TestConstructorValidations extends Validations {
        static objType(): t.ObjType {
          return 'model';
        }
      }

      it('can override', () => {
        expect(TestConstructorValidations.objType()).toEqual('model');
      });
    });
  });

  describe('[static] translate', () => {
    describe('when default', () => {
      it('return correctly', () => {
        expect(() => {
          Validations.translate('propKey', {});
        }).toThrow();
      });
    });

    describe('when override inherited class', () => {
      class TestTranslateValidations extends Validations {
        static translate(key: string, opts?: any): string {
          return `test.${key}`;
        }
      }

      it('can override', () => {
        expect(TestTranslateValidations.translate('propKey', {})).toEqual('test.propKey');
      });
    });
  });

  describe('[static] validates', () => {
    class TestValidatesValidations extends Validations {
      public name: string;

      constructor() {
        super();
        this.name = 'name';
      }
    }
    TestValidatesValidations.validates('name', { presence: true, length: { is: 4 } });
    it('should return correctly', () => {
      expect(Registry.read<rt.ValidationFn[]>('TestValidatesValidations', 'name').length).toEqual(
        2
      );
    });
  });

  describe('#isValid', () => {
    describe('when default', () => {
      const instance = new Validations();

      it('return true', () => {
        const result = instance.isValid();
        expect(result).toEqual(true);
        expect(instance.errors).toEqual({});
      });
    });

    describe('when override inherited class', () => {
      describe('when return true', () => {
        class TestIsValidSkillValidations extends Validations {
          public name: string;
          public year: number;

          // override
          static objType(): t.ObjType {
            return 'model';
          }
          static translate(key: string, opts?: any): string {
            return i18n.t(key, opts).toString();
          }

          constructor(data: { name: string; year: number }) {
            super();
            this.name = data['name'];
            this.year = data['year'];
          }
        }

        // register validations
        TestIsValidSkillValidations.validates('name', { presence: true });
        TestIsValidSkillValidations.validates('year', {
          presence: true,
          numericality: { onlyInteger: true },
        });

        class TestIsValidValidations extends Validations {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: TestIsValidSkillValidations[];

          // override
          static objType(): t.ObjType {
            return 'model';
          }
          static translate(key: string, opts?: any): string {
            return i18n.t(key, opts).toString();
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
              new TestIsValidSkillValidations({ name: 'ruby', year: 5 }),
              new TestIsValidSkillValidations({ name: 'javascript', year: 4 }),
              new TestIsValidSkillValidations({ name: 'typescript', year: 3 }),
              new TestIsValidSkillValidations({ name: 'vue', year: 3 }),
            ];
          }
        }

        // register validations
        TestIsValidValidations.validates('profile.name', { presence: true });
        TestIsValidValidations.validates('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
        });
        TestIsValidValidations.validates('profile.sex', { inclusion: { in: ['man', 'weman'] } });
        TestIsValidValidations.validates('profile.email', { format: { with: 'email' } });
        TestIsValidValidations.validates('ipv4', { format: { with: 'IPv4' } });
        TestIsValidValidations.validates('ipv6', { format: { with: 'IPv6' } });
        TestIsValidValidations.validates('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(',') },
        });
        TestIsValidValidations.validates<TestIsValidSkillValidations[]>('skills', {
          condition: [
            'valid all skills or not',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
        });

        const instance = new TestIsValidValidations();

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
        class TestIsValidErrorsSkillValidations extends Validations {
          public name: string;
          public year: number;

          // override
          static objType(): t.ObjType {
            return 'model';
          }
          static translate(key: string, opts?: any): string {
            return i18n.t(key, opts).toString();
          }

          constructor(data: { name: string; year: number }) {
            super();
            this.name = data['name'];
            this.year = data['year'];
          }
        }

        // register validations
        TestIsValidErrorsSkillValidations.validates('name', { presence: true });
        TestIsValidErrorsSkillValidations.validates('year', {
          presence: true,
          numericality: { onlyInteger: true },
        });

        class TestIsValidErrorsValidations extends Validations {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: TestIsValidErrorsSkillValidations[];

          // override
          static objType(): t.ObjType {
            return 'model';
          }
          static translate(key: string, opts?: any): string {
            return i18n.t(key, opts).toString();
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
              new TestIsValidErrorsSkillValidations({ name: undefined, year: 0.4 }),
              new TestIsValidErrorsSkillValidations({ name: null, year: 0.3 }),
            ];
          }
        }

        // register validations
        TestIsValidErrorsValidations.validates('profile.name', { presence: true });
        TestIsValidErrorsValidations.validates('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
        });
        TestIsValidErrorsValidations.validates('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
        });
        TestIsValidErrorsValidations.validates('profile.email', {
          format: { with: 'email' },
          length: { maximum: 1 },
        });
        TestIsValidErrorsValidations.validates('ipv4', { format: { with: 'IPv4' } });
        TestIsValidErrorsValidations.validates('ipv6', { format: { with: 'IPv6' } });
        TestIsValidErrorsValidations.validates('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(','), is: 1 },
        });
        TestIsValidErrorsValidations.validates<TestIsValidErrorsSkillValidations[]>('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
        });

        const instance = new TestIsValidErrorsValidations();

        it('return errors', () => {
          const result = instance.isValid();
          expect(result).toEqual(false);
          expect(instance.errors['profile']['name'][0].message).toEqual(
            "'models.TestIsValidErrorsValidations.profile.name' can't be empty."
          );
          expect(instance.errors['profile']['year'][0].message).toEqual(
            "'models.TestIsValidErrorsValidations.profile.year' is not only integer."
          );
          expect(instance.errors['profile']['sex'][0].message).toEqual(
            '\'models.TestIsValidErrorsValidations.profile.sex\' is not included in the \'["man","weman"]\'.'
          );
          expect(instance.errors['profile']['email'][0].message).toEqual(
            "'models.TestIsValidErrorsValidations.profile.email' is too long (maximum '1' characters)."
          );
          expect(instance.errors['profile']['email'][1].message).toEqual(
            "'models.TestIsValidErrorsValidations.profile.email' do not meet the format: 'email'."
          );
          expect(instance.errors['ipv4'][0].message).toEqual(
            "'models.TestIsValidErrorsValidations.ipv4' do not meet the format: 'IPv4'."
          );
          expect(instance.errors['ipv6'][0].message).toEqual(
            "'models.TestIsValidErrorsValidations.ipv6' do not meet the format: 'IPv6'."
          );
          expect(instance.errors['tags'][0].message).toEqual(
            "'models.TestIsValidErrorsValidations.tags' is too long (maximum '3' words)."
          );
          expect(instance.errors['tags'][1].message).toEqual(
            "'models.TestIsValidErrorsValidations.tags' is not equal length ('1' characters)."
          );
          expect(instance.errors['skills'][0].message).toEqual(
            "'models.TestIsValidErrorsValidations.skills' do not meet the condition: 'valid all skills'."
          );
          expect(instance.skills[0].errors['name'][0].message).toEqual(
            "'models.TestIsValidErrorsSkillValidations.name' can't be empty."
          );
          expect(instance.skills[0].errors['year'][0].message).toEqual(
            "'models.TestIsValidErrorsSkillValidations.year' is not only integer."
          );
          expect(instance.skills[1].errors['name'][0].message).toEqual(
            "'models.TestIsValidErrorsSkillValidations.name' can't be empty."
          );
          expect(instance.skills[1].errors['year'][0].message).toEqual(
            "'models.TestIsValidErrorsSkillValidations.year' is not only integer."
          );
        });
      });

      describe('when skip (using if)', () => {
        class TestIsValidSkipSkillValidations extends Validations {
          public name: string;
          public year: number;

          // override
          static objType(): t.ObjType {
            return 'model';
          }
          static translate(key: string, opts?: any): string {
            return i18n.t(key, opts).toString();
          }

          constructor(data: { name: string; year: number }) {
            super();
            this.name = data['name'];
            this.year = data['year'];
          }
        }

        // register validations
        TestIsValidSkipSkillValidations.validates<string>('name', {
          presence: true,
          if: (propVal, self) => propVal == '',
        });
        TestIsValidSkipSkillValidations.validates<number>('year', {
          presence: true,
          numericality: { onlyInteger: true },
          if: (propVal, self) => propVal == 0,
        });

        class TestIsValidSkipValidations extends Validations {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: TestIsValidSkipSkillValidations[];

          // override
          static objType(): t.ObjType {
            return 'model';
          }
          static translate(key: string, opts?: any): string {
            return i18n.t(key, opts).toString();
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
              new TestIsValidSkipSkillValidations({ name: undefined, year: 0.4 }),
              new TestIsValidSkipSkillValidations({ name: null, year: 0.3 }),
            ];
          }
        }

        // register validations
        TestIsValidSkipValidations.validates<string>('profile.name', {
          presence: true,
          if: (propVal, self) => propVal == 'dhh',
        });
        TestIsValidSkipValidations.validates<number>('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
          if: (propVal, self) => propVal == 0,
        });
        TestIsValidSkipValidations.validates<string>('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
          if: (propVal, self) => propVal == 'unknownn',
        });
        TestIsValidSkipValidations.validates<string>('profile.email', {
          format: { with: 'email' },
          if: (propVal, self) => propVal.startsWith('test'),
        });
        TestIsValidSkipValidations.validates<string>('ipv4', {
          format: { with: 'IPv4' },
          if: (propVal, self) => propVal == '',
        });
        TestIsValidSkipValidations.validates<string>('ipv6', {
          format: { with: 'IPv6' },
          if: (propVal, self) => propVal == '',
        });
        TestIsValidSkipValidations.validates<string>('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(',') },
          if: (propVal, self) => propVal == '',
        });
        TestIsValidSkipValidations.validates<TestIsValidSkipSkillValidations[]>('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
          if: (propVal, self) => propVal == [],
        });

        const instance = new TestIsValidSkipValidations();

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
        class TestIsValidAllowSkillValidations extends Validations {
          public name: string;
          public year: number;

          // override
          static objType(): t.ObjType {
            return 'model';
          }
          static translate(key: string, opts?: any): string {
            return i18n.t(key, opts).toString();
          }

          constructor(data: { name: string; year: number }) {
            super();
            this.name = data['name'];
            this.year = data['year'];
          }
        }

        // register validations
        TestIsValidAllowSkillValidations.validates<string>('name', {
          presence: true,
          allow_null: true,
          allow_undefined: true,
        });
        TestIsValidAllowSkillValidations.validates<number>('year', {
          presence: true,
          numericality: { onlyInteger: true },
          allow_null: true,
        });

        class TestIsValidAllowValidations extends Validations {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: TestIsValidAllowSkillValidations[];

          // override
          static objType(): t.ObjType {
            return 'model';
          }
          static translate(key: string, opts?: any): string {
            return i18n.t(key, opts).toString();
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
              new TestIsValidAllowSkillValidations({ name: undefined, year: undefined }),
              new TestIsValidAllowSkillValidations({ name: null, year: null }),
            ];
          }
        }

        // register validations
        TestIsValidAllowValidations.validates<string>('profile.name', {
          presence: true,
          allow_blank: true,
        });
        TestIsValidAllowValidations.validates<number>('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
          allow_null: true,
        });
        TestIsValidAllowValidations.validates<string>('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
          allow_undefined: true,
        });
        TestIsValidAllowValidations.validates<string>('profile.email', {
          format: { with: 'email' },
          allow_blank: true,
        });
        TestIsValidAllowValidations.validates<string>('ipv4', {
          format: { with: 'IPv4' },
          allow_null: true,
        });
        TestIsValidAllowValidations.validates<string>('ipv6', {
          format: { with: 'IPv6' },
          allow_undefined: true,
        });
        TestIsValidAllowValidations.validates<string>('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(',') },
          allow_blank: true,
        });
        TestIsValidAllowValidations.validates<TestIsValidAllowSkillValidations[]>('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
        });

        const instance = new TestIsValidAllowValidations();

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
        class TestIsValidOverrideMsgSkillValidations extends Validations {
          public name: string;
          public year: number;

          // override
          static objType(): t.ObjType {
            return 'model';
          }
          static translate(key: string, opts?: any): string {
            return i18n.t(key, opts).toString();
          }

          constructor(data: { name: string; year: number }) {
            super();
            this.name = data['name'];
            this.year = data['year'];
          }
        }

        // register validations
        TestIsValidOverrideMsgSkillValidations.validates('name', {
          presence: true,
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgSkillValidations.validates('year', {
          presence: true,
          numericality: { onlyInteger: true },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });

        class TestIsValidOverrideMsgValidations extends Validations {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: TestIsValidOverrideMsgSkillValidations[];

          // override
          static objType(): t.ObjType {
            return 'model';
          }
          static translate(key: string, opts?: any): string {
            return i18n.t(key, opts).toString();
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
              new TestIsValidOverrideMsgSkillValidations({ name: undefined, year: 0.4 }),
              new TestIsValidOverrideMsgSkillValidations({ name: null, year: 0.3 }),
            ];
          }
        }

        // register validations
        TestIsValidOverrideMsgValidations.validates('profile.name', {
          presence: true,
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgValidations.validates('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgValidations.validates('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgValidations.validates('profile.email', {
          format: { with: 'email' },
          length: { maximum: 1 },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgValidations.validates('ipv4', {
          format: { with: 'IPv4' },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgValidations.validates('ipv6', {
          format: { with: 'IPv6' },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgValidations.validates('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(','), is: 1 },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        TestIsValidOverrideMsgValidations.validates<
          TestIsValidOverrideMsgSkillValidations[],
          TestIsValidOverrideMsgValidations
        >('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
          message: (tPropKey, propVal, self) =>
            `${tPropKey}|${JSON.stringify(propVal)}|${self.profile.year}`,
        });

        const instance = new TestIsValidOverrideMsgValidations();

        it('return errors', () => {
          const result = instance.isValid();
          expect(result).toEqual(false);
          expect(instance.errors['profile']['name'][0].message).toEqual(
            'models.TestIsValidOverrideMsgValidations.profile.name|undefined'
          );
          expect(instance.errors['profile']['year'][0].message).toEqual(
            'models.TestIsValidOverrideMsgValidations.profile.year|0.1'
          );
          expect(instance.errors['profile']['sex'][0].message).toEqual(
            'models.TestIsValidOverrideMsgValidations.profile.sex|unknown'
          );
          expect(instance.errors['profile']['email'][0].message).toEqual(
            'models.TestIsValidOverrideMsgValidations.profile.email|email address'
          );
          expect(instance.errors['profile']['email'][1].message).toEqual(
            'models.TestIsValidOverrideMsgValidations.profile.email|email address'
          );
          expect(instance.errors['ipv4'][0].message).toEqual(
            'models.TestIsValidOverrideMsgValidations.ipv4|123456789'
          );
          expect(instance.errors['ipv6'][0].message).toEqual(
            'models.TestIsValidOverrideMsgValidations.ipv6|1234567890'
          );
          expect(instance.errors['tags'][0].message).toEqual(
            'models.TestIsValidOverrideMsgValidations.tags|rails,vue,typescript,react'
          );
          expect(instance.errors['tags'][1].message).toEqual(
            'models.TestIsValidOverrideMsgValidations.tags|rails,vue,typescript,react'
          );
          expect(instance.errors['skills'][0].message).toEqual(
            'models.TestIsValidOverrideMsgValidations.skills|[{"errors":{},"year":0.4},{"errors":{},"name":null,"year":0.3}]|0.1'
          );
          expect(instance.skills[0].errors['name'][0].message).toEqual(
            'models.TestIsValidOverrideMsgSkillValidations.name|undefined'
          );
          expect(instance.skills[0].errors['year'][0].message).toEqual(
            'models.TestIsValidOverrideMsgSkillValidations.year|0.4'
          );
          expect(instance.skills[1].errors['name'][0].message).toEqual(
            'models.TestIsValidOverrideMsgSkillValidations.name|null'
          );
          expect(instance.skills[1].errors['year'][0].message).toEqual(
            'models.TestIsValidOverrideMsgSkillValidations.year|0.3'
          );
        });
      });
    });
  });
});
