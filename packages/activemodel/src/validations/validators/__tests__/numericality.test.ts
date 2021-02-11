import { validate as validateNumericality } from '../numericality';
import { ErrCodes } from '@/errors';

// types
import type * as et from '@/errors';

const translate = (key: string) => `test.${key}`;

describe('validateNumericality', () => {
  describe('when return errors', () => {
    describe("when specify 'onlyInteger'", () => {
      const errors = validateNumericality(
        'propKey',
        0.1,
        { onlyInteger: true },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_ONLY_INTEGER_NUMERIC);
        expect(errors[0].message).toEqual("'test.propKey' is not only integer.");
      });
    });

    describe("when specify 'greaterThan'", () => {
      const errors = validateNumericality(
        'propKey',
        1,
        { greaterThan: 1 },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_GREATER_THAN_NUMERIC);
        expect(errors[0].message).toEqual("'test.propKey' is not greater than '1'.");
      });
    });

    describe("when specify 'greaterThanOrEqualTo'", () => {
      const errors = validateNumericality(
        'propKey',
        1,
        { greaterThanOrEqualTo: 2 },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_GREATER_THAN_OR_EQUAL_TO_NUMERIC);
        expect(errors[0].message).toEqual("'test.propKey' is not greater than or equal to '2'.");
      });
    });

    describe("when specify 'equalTo'", () => {
      const errors = validateNumericality('propKey', 1, { equalTo: 2 }, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EQUAL_TO_NUMERIC);
        expect(errors[0].message).toEqual("'test.propKey' is not equal to '2'.");
      });
    });

    describe("when specify 'lessThan'", () => {
      const errors = validateNumericality('propKey', 1, { lessThan: 1 }, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_LESS_THAN_NUMERIC);
        expect(errors[0].message).toEqual("'test.propKey' is not less than '1'.");
      });
    });

    describe("when specify 'lessThanOrEqualTo'", () => {
      const errors = validateNumericality(
        'propKey',
        2,
        { lessThanOrEqualTo: 1 },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_LESS_THAN_OR_EQUAL_TO_NUMERIC);
        expect(errors[0].message).toEqual("'test.propKey' is not less than or equal to '1'.");
      });
    });

    describe("when specify 'odd'", () => {
      const errors = validateNumericality('propKey', 2, { odd: true }, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_ODD_NUMERIC);
        expect(errors[0].message).toEqual("'test.propKey' is not odd.");
      });
    });

    describe("when specify 'even'", () => {
      const errors = validateNumericality('propKey', 3, { even: true }, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EVEN_NUMERIC);
        expect(errors[0].message).toEqual("'test.propKey' is not even.");
      });
    });

    describe("when specify 'even / override message'", () => {
      const errors = validateNumericality(
        'propKey',
        3,
        { even: true },
        translate,
        'override message'
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EVEN_NUMERIC);
        expect(errors[0].message).toEqual('override message');
      });
    });
  });

  describe('when return true', () => {
    describe("when specify 'onlyInteger'", () => {
      const result = validateNumericality(
        'propKey',
        1,
        { onlyInteger: true },
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'greaterThan'", () => {
      const result = validateNumericality('propKey', 2, { greaterThan: 1 }, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'greaterThanOrEqualTo'", () => {
      const result = validateNumericality(
        'propKey',
        1,
        { greaterThanOrEqualTo: 1 },
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'equalTo'", () => {
      const result = validateNumericality('propKey', 1, { equalTo: 1 }, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'lessThan'", () => {
      const result = validateNumericality('propKey', 1, { lessThan: 2 }, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'lessThanOrEqualTo'", () => {
      const result = validateNumericality(
        'propKey',
        1,
        { lessThanOrEqualTo: 1 },
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'odd'", () => {
      const result = validateNumericality('propKey', 1, { odd: true }, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'even'", () => {
      const result = validateNumericality('propKey', 2, { even: true }, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });
  });
});
