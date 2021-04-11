import { validate as validateCondition } from '../condition';
import { ErrCodes } from '@/errors';

// types
import type * as et from '@/errors';

const translate = (key: string) => `test.${key}`;

describe('validateCondition', () => {
  describe('when return errors', () => {
    describe("when 'propVal' is 'string'", () => {
      const errors = validateCondition<string, any>(
        {},
        'propKey',
        '',
        ['propVal must be exist.', (propVal, self) => (propVal as string).length > 0],
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION);
        expect(errors[0].message).toEqual(
          "'test.propKey' do not meet the condition: 'propVal must be exist.'."
        );
      });
    });

    describe("when 'propVal' is 'number'", () => {
      const errors = validateCondition<number, any>(
        {},
        'propKey',
        0,
        ['propVal must be 1', (propVal, self) => (propVal as number) == 1],
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION);
        expect(errors[0].message).toEqual(
          "'test.propKey' do not meet the condition: 'propVal must be 1'."
        );
      });
    });

    describe("when 'propVal' is 'boolean'", () => {
      const errors = validateCondition<boolean, any>(
        {},
        'propKey',
        false,
        ['propVal must be true', (propVal, self) => (propVal as boolean) == true],
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION);
        expect(errors[0].message).toEqual(
          "'test.propKey' do not meet the condition: 'propVal must be true'."
        );
      });
    });

    describe("when 'propVal' is 'string[]'", () => {
      const errors = validateCondition<string[], any>(
        {},
        'propKey',
        ['propVal'],
        [
          'propVal must be contained in the list.',
          (propVal, self) => ['propVal_1', 'propVal_2'].includes(propVal[0]),
        ],
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION);
        expect(errors[0].message).toEqual(
          "'test.propKey' do not meet the condition: 'propVal must be contained in the list.'."
        );
      });
    });

    describe("when 'propVal' is 'number[]'", () => {
      const errors = validateCondition<number[], any>(
        {},
        'propKey',
        [1],
        ['propVal must be contained in the list.', (propVal, self) => [2, 3].includes(propVal[1])],
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION);
        expect(errors[0].message).toEqual(
          "'test.propKey' do not meet the condition: 'propVal must be contained in the list.'."
        );
      });
    });

    describe("when 'propVal' is 'boolean[]'", () => {
      const errors = validateCondition<boolean[], any>(
        {},
        'propKey',
        [true],
        ['propVal must be contained in the list.', (propVal, self) => [false].includes(propVal[0])],
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION);
        expect(errors[0].message).toEqual(
          "'test.propKey' do not meet the condition: 'propVal must be contained in the list.'."
        );
      });
    });

    describe("when 'propVal' is 'object'", () => {
      const errors = validateCondition<object, any>(
        {},
        'propKey',
        {},
        ['propVal must not be empty', (propVal, self) => Object.keys(propVal as any).length > 0],
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION);
        expect(errors[0].message).toEqual(
          "'test.propKey' do not meet the condition: 'propVal must not be empty'."
        );
      });
    });

    describe("when use 'self'", () => {
      const errors = validateCondition<object, object>(
        { self: 'self' },
        'propKey',
        {},
        ['self value must be empty', (propVal, self) => Object.keys(self).length == 0],
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION);
        expect(errors[0].message).toEqual(
          "'test.propKey' do not meet the condition: 'self value must be empty'."
        );
      });
    });

    describe("when use 'self (override message)'", () => {
      const errors = validateCondition<object, object>(
        { self: 'self' },
        'propKey',
        {},
        ['self value must be empty', (propVal, self) => Object.keys(self).length == 0],
        translate,
        'override message'
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION);
        expect(errors[0].message).toEqual('override message');
      });
    });

    describe("when 'propVal' is 'undefined'", () => {
      const errors = validateCondition<undefined, any>(
        {},
        'propKey',
        undefined,
        ['propVal must not be undefined', (propVal, self) => propVal != undefined],
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_CONDITION);
        expect(errors[0].message).toEqual(
          "'test.propKey' do not meet the condition: 'propVal must not be undefined'."
        );
      });
    });
  });

  describe('when return true', () => {
    describe("when 'propVal' is 'string'", () => {
      const result = validateCondition<string, any>(
        {},
        'propKey',
        'propVal',
        ['propVal must be exist.', (propVal, self) => (propVal as string).length > 0],
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'number'", () => {
      const result = validateCondition<number, any>(
        {},
        'propKey',
        1,
        ['propVal must be 1', (propVal, self) => (propVal as number) == 1],
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'boolean'", () => {
      const result = validateCondition<boolean, any>(
        {},
        'propKey',
        true,
        ['propVal must be true', (propVal, self) => (propVal as boolean) == true],
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'string[]'", () => {
      const result = validateCondition<string[], any>(
        {},
        'propKey',
        ['propVal_1'],
        [
          'propVal must be contained in the list.',
          (propVal, self) => ['propVal_1', 'propVal_2'].includes(propVal[0]),
        ],
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'number[]'", () => {
      const result = validateCondition<number[], any>(
        {},
        'propKey',
        [2],
        ['propVal must be contained in the list.', (propVal, self) => [2, 3].includes(propVal[0])],
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'boolean[]'", () => {
      const result = validateCondition<boolean[], any>(
        {},
        'propKey',
        [false],
        [
          'propVal must be contained in the list.',
          (propVal, self) => [true, false].includes(propVal[0]),
        ],
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'undefined'", () => {
      const result = validateCondition<undefined, any>(
        {},
        'propKey',
        undefined,
        ['propVal must be undefined', (propVal, self) => propVal === undefined],
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });
  });
});
