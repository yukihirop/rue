import { Core as Validations } from '../core';
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
      class TestValidations extends Validations {
        static objType(): t.ObjType {
          return 'model';
        }
      }

      it('can override', () => {
        expect(TestValidations.objType()).toEqual('model');
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
      class TestValidations extends Validations {
        static translate(key: string, opts?: any): string {
          return `test.${key}`;
        }
      }

      it('can override', () => {
        expect(TestValidations.translate('propKey', {})).toEqual('test.propKey');
      });
    });
  });

  describe('[static] validates', () => {
    class TestValidations extends Validations {
      public name: string;

      constructor() {
        super();
        this.name = 'name';
      }
    }
    TestValidations.validates('name', { presence: true, length: { is: 4 } });
    it('should return correctly', () => {
      expect(Registry.read<rt.ValidationFn[]>('TestValidations', 'name').length).toEqual(2);
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
        class Test1SkillValidations extends Validations {
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
        Test1SkillValidations.validates('name', { presence: true });
        Test1SkillValidations.validates('year', {
          presence: true,
          numericality: { onlyInteger: true },
        });

        class Test1Validations extends Validations {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: Test1SkillValidations[];

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
              new Test1SkillValidations({ name: 'ruby', year: 5 }),
              new Test1SkillValidations({ name: 'javascript', year: 4 }),
              new Test1SkillValidations({ name: 'typescript', year: 3 }),
              new Test1SkillValidations({ name: 'vue', year: 3 }),
            ];
          }
        }

        // register validations
        Test1Validations.validates('profile.name', { presence: true });
        Test1Validations.validates('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
        });
        Test1Validations.validates('profile.sex', { inclusion: { in: ['man', 'weman'] } });
        Test1Validations.validates('profile.email', { format: { with: 'email' } });
        Test1Validations.validates('ipv4', { format: { with: 'IPv4' } });
        Test1Validations.validates('ipv6', { format: { with: 'IPv6' } });
        Test1Validations.validates('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(',') },
        });
        Test1Validations.validates<Test1SkillValidations[]>('skills', {
          condition: [
            'valid all skills or not',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
        });

        const instance = new Test1Validations();

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
        class Test2SkillValidations extends Validations {
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
        Test2SkillValidations.validates('name', { presence: true });
        Test2SkillValidations.validates('year', {
          presence: true,
          numericality: { onlyInteger: true },
        });

        class Test2Validations extends Validations {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: Test2SkillValidations[];

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
              new Test2SkillValidations({ name: undefined, year: 0.4 }),
              new Test2SkillValidations({ name: null, year: 0.3 }),
            ];
          }
        }

        // register validations
        Test2Validations.validates('profile.name', { presence: true });
        Test2Validations.validates('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
        });
        Test2Validations.validates('profile.sex', { inclusion: { in: ['man', 'weman'] } });
        Test2Validations.validates('profile.email', {
          format: { with: 'email' },
          length: { maximum: 1 },
        });
        Test2Validations.validates('ipv4', { format: { with: 'IPv4' } });
        Test2Validations.validates('ipv6', { format: { with: 'IPv6' } });
        Test2Validations.validates('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(','), is: 1 },
        });
        Test2Validations.validates<Test2SkillValidations[]>('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
        });

        const instance = new Test2Validations();

        it('return errors', () => {
          const result = instance.isValid();
          expect(result).toEqual(false);
          expect(instance.errors['profile']['name'][0].message).toEqual(
            "'models.Test2Validations.profile.name' can't be empty."
          );
          expect(instance.errors['profile']['year'][0].message).toEqual(
            "'models.Test2Validations.profile.year' is not only integer."
          );
          expect(instance.errors['profile']['sex'][0].message).toEqual(
            '\'models.Test2Validations.profile.sex\' is not included in the \'["man","weman"]\'.'
          );
          expect(instance.errors['profile']['email'][0].message).toEqual(
            "'models.Test2Validations.profile.email' is too long (maximum '1' characters)."
          );
          expect(instance.errors['profile']['email'][1].message).toEqual(
            "'models.Test2Validations.profile.email' do not meet the format: 'email'."
          );
          expect(instance.errors['ipv4'][0].message).toEqual(
            "'models.Test2Validations.ipv4' do not meet the format: 'IPv4'."
          );
          expect(instance.errors['ipv6'][0].message).toEqual(
            "'models.Test2Validations.ipv6' do not meet the format: 'IPv6'."
          );
          expect(instance.errors['tags'][0].message).toEqual(
            "'models.Test2Validations.tags' is too long (maximum '3' words)."
          );
          expect(instance.errors['tags'][1].message).toEqual(
            "'models.Test2Validations.tags' is not equal length ('1' characters)."
          );
          expect(instance.errors['skills'][0].message).toEqual(
            "'models.Test2Validations.skills' do not meet the condition: 'valid all skills'."
          );
          expect(instance.skills[0].errors['name'][0].message).toEqual(
            "'models.Test2SkillValidations.name' can't be empty."
          );
          expect(instance.skills[0].errors['year'][0].message).toEqual(
            "'models.Test2SkillValidations.year' is not only integer."
          );
          expect(instance.skills[1].errors['name'][0].message).toEqual(
            "'models.Test2SkillValidations.name' can't be empty."
          );
          expect(instance.skills[1].errors['year'][0].message).toEqual(
            "'models.Test2SkillValidations.year' is not only integer."
          );
        });
      });

      describe('when skip (using if)', () => {
        class Test3SkillValidations extends Validations {
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
        Test3SkillValidations.validates<string>('name', {
          presence: true,
          if: (propVal, self) => propVal == '',
        });
        Test3SkillValidations.validates<number>('year', {
          presence: true,
          numericality: { onlyInteger: true },
          if: (propVal, self) => propVal == 0,
        });

        class Test3Validations extends Validations {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: Test3SkillValidations[];

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
              new Test3SkillValidations({ name: undefined, year: 0.4 }),
              new Test3SkillValidations({ name: null, year: 0.3 }),
            ];
          }
        }

        // register validations
        Test3Validations.validates<string>('profile.name', {
          presence: true,
          if: (propVal, self) => propVal == 'dhh',
        });
        Test3Validations.validates<number>('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
          if: (propVal, self) => propVal == 0,
        });
        Test3Validations.validates<string>('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
          if: (propVal, self) => propVal == 'unknownn',
        });
        Test3Validations.validates<string>('profile.email', {
          format: { with: 'email' },
          if: (propVal, self) => propVal.startsWith('test'),
        });
        Test3Validations.validates<string>('ipv4', {
          format: { with: 'IPv4' },
          if: (propVal, self) => propVal == '',
        });
        Test3Validations.validates<string>('ipv6', {
          format: { with: 'IPv6' },
          if: (propVal, self) => propVal == '',
        });
        Test3Validations.validates<string>('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(',') },
          if: (propVal, self) => propVal == '',
        });
        Test3Validations.validates<Test3SkillValidations[]>('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
          if: (propVal, self) => propVal == [],
        });

        const instance = new Test3Validations();

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
        class Test4SkillValidations extends Validations {
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
        Test4SkillValidations.validates<string>('name', {
          presence: true,
          allow_null: true,
          allow_undefined: true,
        });
        Test4SkillValidations.validates<number>('year', {
          presence: true,
          numericality: { onlyInteger: true },
          allow_null: true,
        });

        class Test4Validations extends Validations {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: Test4SkillValidations[];

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
              new Test4SkillValidations({ name: undefined, year: undefined }),
              new Test4SkillValidations({ name: null, year: null }),
            ];
          }
        }

        // register validations
        Test4Validations.validates<string>('profile.name', {
          presence: true,
          allow_blank: true,
        });
        Test4Validations.validates<number>('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
          allow_null: true,
        });
        Test4Validations.validates<string>('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
          allow_undefined: true,
        });
        Test4Validations.validates<string>('profile.email', {
          format: { with: 'email' },
          allow_blank: true,
        });
        Test4Validations.validates<string>('ipv4', {
          format: { with: 'IPv4' },
          allow_null: true,
        });
        Test4Validations.validates<string>('ipv6', {
          format: { with: 'IPv6' },
          allow_undefined: true,
        });
        Test4Validations.validates<string>('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(',') },
          allow_blank: true,
        });
        Test4Validations.validates<Test4SkillValidations[]>('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
        });

        const instance = new Test4Validations();

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
        class Test5SkillValidations extends Validations {
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
        Test5SkillValidations.validates('name', {
          presence: true,
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        Test5SkillValidations.validates('year', {
          presence: true,
          numericality: { onlyInteger: true },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });

        class Test5Validations extends Validations {
          public profile: {
            name: string;
            year: number;
            sex: string;
            email: string;
          };
          public ipv4: string;
          public ipv6: string;
          public tags: string;
          public skills: Test5SkillValidations[];

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
              new Test5SkillValidations({ name: undefined, year: 0.4 }),
              new Test5SkillValidations({ name: null, year: 0.3 }),
            ];
          }
        }

        // register validations
        Test5Validations.validates('profile.name', {
          presence: true,
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        Test5Validations.validates('profile.year', {
          numericality: { onlyInteger: true, greaterThanOrEqualTo: 20 },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        Test5Validations.validates('profile.sex', {
          inclusion: { in: ['man', 'weman'] },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        Test5Validations.validates('profile.email', {
          format: { with: 'email' },
          length: { maximum: 1 },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        Test5Validations.validates('ipv4', {
          format: { with: 'IPv4' },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        Test5Validations.validates('ipv6', {
          format: { with: 'IPv6' },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        Test5Validations.validates('tags', {
          length: { maximum: 3, tokenizer: (propVal, self) => propVal.split(','), is: 1 },
          message: (tPropKey, propVal, self) => `${tPropKey}|${propVal}`,
        });
        Test5Validations.validates<Test5SkillValidations[], Test5Validations>('skills', {
          condition: [
            'valid all skills',
            (propVal, self) => propVal.map((model) => model.isValid()).every(Boolean),
          ],
          message: (tPropKey, propVal, self) =>
            `${tPropKey}|${JSON.stringify(propVal)}|${self.profile.year}`,
        });

        const instance = new Test5Validations();

        it('return errors', () => {
          const result = instance.isValid();
          expect(result).toEqual(false);
          expect(instance.errors['profile']['name'][0].message).toEqual(
            'models.Test5Validations.profile.name|undefined'
          );
          expect(instance.errors['profile']['year'][0].message).toEqual(
            'models.Test5Validations.profile.year|0.1'
          );
          expect(instance.errors['profile']['sex'][0].message).toEqual(
            'models.Test5Validations.profile.sex|unknown'
          );
          expect(instance.errors['profile']['email'][0].message).toEqual(
            'models.Test5Validations.profile.email|email address'
          );
          expect(instance.errors['profile']['email'][1].message).toEqual(
            'models.Test5Validations.profile.email|email address'
          );
          expect(instance.errors['ipv4'][0].message).toEqual(
            'models.Test5Validations.ipv4|123456789'
          );
          expect(instance.errors['ipv6'][0].message).toEqual(
            'models.Test5Validations.ipv6|1234567890'
          );
          expect(instance.errors['tags'][0].message).toEqual(
            'models.Test5Validations.tags|rails,vue,typescript,react'
          );
          expect(instance.errors['tags'][1].message).toEqual(
            'models.Test5Validations.tags|rails,vue,typescript,react'
          );
          expect(instance.errors['skills'][0].message).toEqual(
            'models.Test5Validations.skills|[{"errors":{},"year":0.4},{"errors":{},"name":null,"year":0.3}]|0.1'
          );
          expect(instance.skills[0].errors['name'][0].message).toEqual(
            'models.Test5SkillValidations.name|undefined'
          );
          expect(instance.skills[0].errors['year'][0].message).toEqual(
            'models.Test5SkillValidations.year|0.4'
          );
          expect(instance.skills[1].errors['name'][0].message).toEqual(
            'models.Test5SkillValidations.name|null'
          );
          expect(instance.skills[1].errors['year'][0].message).toEqual(
            'models.Test5SkillValidations.year|0.3'
          );
        });
      });
    });
  });
});
