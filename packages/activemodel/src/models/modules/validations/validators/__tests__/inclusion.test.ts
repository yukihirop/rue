import { validate as validateInclusion } from '../inclusion';
import { ErrCodes } from '@/errors';

// types
import type * as et from '@/errors';

const translate = (key: string) => `test.${key}`;

describe('validateInclusion', () => {
  describe("when specify 'in' option", () => {
    describe('when return errors', () => {
      describe("when 'propVal' is not included 'list' (when string)", () => {
        const errors = validateInclusion(
          'propKey',
          'propVal',
          { in: ['propVal_1', 'propVal_2'] },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@ruejs/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_INCLUDED);
          expect(errors[0].message).toEqual(
            '\'test.propKey\' is not included in the \'["propVal_1","propVal_2"]\'.'
          );
        });
      });

      describe("when 'propVal' is not included 'list' (when number)", () => {
        const errors = validateInclusion('propKey', 1, { in: [2, 3] }, translate) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@ruejs/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_INCLUDED);
          expect(errors[0].message).toEqual("'test.propKey' is not included in the '[2,3]'.");
        });
      });

      describe("when 'propVal' is not included 'list' (when boolean)", () => {
        const errors = validateInclusion(
          'propKey',
          1,
          { in: [true, false] },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@ruejs/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_INCLUDED);
          expect(errors[0].message).toEqual(
            "'test.propKey' is not included in the '[true,false]'."
          );
        });
      });

      describe("when 'propVal' is not included 'list' (when undefined)", () => {
        const errors = validateInclusion(
          'propKey',
          'propVal',
          { in: [undefined] },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@ruejs/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_INCLUDED);
          expect(errors[0].message).toEqual(
            "'test.propKey' is not included in the '[\"undefined\"]'."
          );
        });
      });

      describe("when 'propVal' is not included 'list' (when null)", () => {
        const errors = validateInclusion(
          'propKey',
          'propVal',
          { in: [null] },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@ruejs/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_INCLUDED);
          expect(errors[0].message).toEqual("'test.propKey' is not included in the '[null]'.");
        });
      });

      describe("when 'propVal' is not included 'list' (when mix)", () => {
        const errors = validateInclusion(
          'propKey',
          1,
          { in: ['propVal', 2, true, false, undefined, null] },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@ruejs/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_INCLUDED);
          expect(errors[0].message).toEqual(
            '\'test.propKey\' is not included in the \'["propVal",2,true,false,"undefined",null]\'.'
          );
        });
      });

      describe("when 'propVal' is not included 'list' (when mix / override message)", () => {
        const errors = validateInclusion(
          'propKey',
          1,
          { in: ['propVal', 2, true, false, undefined, null] },
          translate,
          'override message'
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@ruejs/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_INCLUDED);
          expect(errors[0].message).toEqual('override message');
        });
      });

      describe("when 'propVal' is 'undefined'", () => {
        const errors = validateInclusion(
          'propKey',
          undefined,
          { in: [true, false] },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@ruejs/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_INCLUDED);
          expect(errors[0].message).toEqual(
            "'test.propKey' is not included in the '[true,false]'."
          );
        });
      });
    });

    describe('when reurn true', () => {
      describe("when 'propVal' is included 'list' (when string)", () => {
        const result = validateInclusion(
          'propKey',
          'propVal',
          { in: ['propVal', 'propVal_1'] },
          translate
        ) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });

      describe("when 'propVal' is included 'list' (when number)", () => {
        const result = validateInclusion('propKey', 1, { in: [1, 2] }, translate) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });

      describe("when 'propVal' is included 'list' (when boolean)", () => {
        const result = validateInclusion(
          'propKey',
          true,
          { in: [true, false] },
          translate
        ) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });

      describe("when 'propVal' is included 'list' (when undefined)", () => {
        const result = validateInclusion(
          'propKey',
          undefined,
          { in: [undefined] },
          translate
        ) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });

      describe("when 'propVal' is included 'list' (when null)", () => {
        const result = validateInclusion('propKey', null, { in: [null] }, translate) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });

      describe("when 'propVal' is included 'list' (when mix)", () => {
        const result = validateInclusion(
          'propKey',
          'propVal',
          { in: ['propVal', 1, true, false] },
          translate
        ) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });
    });
  });
});
