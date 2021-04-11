import { validate as validateLength } from '../length';
import { ErrCodes } from '@/errors';

// types
import type * as et from '@/errors';

const translate = (key: string) => `test.${key}`;

describe('validateLength', () => {
  describe('when return errors', () => {
    describe("when specify 'maximum'", () => {
      const errors = validateLength(
        {},
        'propKey',
        'propVal',
        { maximum: 6 },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_TOO_LONG_CHARS_LENGTH);
        expect(errors[0].message).toEqual("'test.propKey' is too long (maximum '6' characters).");
      });

      describe("when specify 'tokenizer'", () => {
        const errors = validateLength(
          {},
          'propKey',
          'a b c d',
          { maximum: 3, tokenizer: (propVal, _) => propVal.split(' ') },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@ruejs/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_TOO_LONG_WORDS_LENGTH);
          expect(errors[0].message).toEqual("'test.propKey' is too long (maximum '3' words).");
        });
      });
    });

    describe("when specify 'maximum'", () => {
      const errors = validateLength(
        {},
        'propKey',
        'propVal',
        { minimum: 8 },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_TOO_SHORT_CHARS_LENGTH);
        expect(errors[0].message).toEqual("'test.propKey' is too short (minimum '8' characters).");
      });

      describe("when specify 'tokenizer'", () => {
        const errors = validateLength(
          {},
          'propKey',
          'a b c d',
          { minimum: 5, tokenizer: (propVal, _) => propVal.split(' ') },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@ruejs/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_TOO_SHORT_WORDS_LENGTH);
          expect(errors[0].message).toEqual("'test.propKey' is too short (minimum '5' words).");
        });
      });
    });

    describe("when specify 'is'", () => {
      const errors = validateLength({}, 'propKey', 'propVal', { is: 6 }, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EQUAL_LENGTH);
        expect(errors[0].message).toEqual("'test.propKey' is not equal length ('6' characters).");
      });
    });

    describe("when specify 'in'", () => {
      const errors = validateLength(
        {},
        'propKey',
        'propVal',
        { in: [1, 2] },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_WITHIN_LENGTH);
        expect(errors[0].message).toEqual("'test.propKey' is not within length (range: '[1,2]').");
      });
    });

    describe("when specify 'within' (alias 'in')", () => {
      const errors = validateLength(
        {},
        'propKey',
        'propVal',
        { within: [1, 2] },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_WITHIN_LENGTH);
        expect(errors[0].message).toEqual("'test.propKey' is not within length (range: '[1,2]').");
      });
    });

    describe("when specify 'within' (alias 'in' / override message)", () => {
      const errors = validateLength(
        {},
        'propKey',
        'propVal',
        { within: [1, 2] },
        translate,
        'override message'
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_WITHIN_LENGTH);
        expect(errors[0].message).toEqual('override message');
      });
    });

    describe("when 'propVal' is 'undefine'", () => {
      const errors = validateLength(
        {},
        'propKey',
        undefined,
        { within: [1, 2] },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@ruejs/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_WITHIN_LENGTH);
        expect(errors[0].message).toEqual("'test.propKey' is not within length (range: '[1,2]').");
      });
    });
  });

  describe('when return true', () => {
    describe("when specify 'maximum'", () => {
      const result = validateLength({}, 'propKey', 'propVal', { maximum: 7 }, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });

      describe("when specify 'tokenizer'", () => {
        const result = validateLength(
          {},
          'propKey',
          'a b c d',
          { maximum: 4, tokenizer: (propVal, _) => propVal.split(' ') },
          translate
        ) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });
    });

    describe("when specify 'maximum'", () => {
      const result = validateLength({}, 'propKey', 'propVal', { minimum: 7 }, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });

      describe("when specify 'tokenizer'", () => {
        const result = validateLength(
          {},
          'propKey',
          'a b c d',
          { minimum: 4, tokenizer: (propVal, _) => propVal.split(' ') },
          translate
        ) as boolean;
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });
    });

    describe("when specify 'is'", () => {
      const result = validateLength({}, 'propKey', 'propVal', { is: 7 }, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'in'", () => {
      const result = validateLength({}, 'propKey', 'propVal', { in: [0, 7] }, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'within' (alias 'in')", () => {
      const result = validateLength(
        {},
        'propKey',
        'propVal',
        { within: [0, 7] },
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });
  });
});
