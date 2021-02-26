import { validate as validateExclusion } from '../exclusion';
import { ErrCodes } from '@/errors';

// types
import type * as et from '@/errors';

const translate = (key: string) => `test.${key}`;

describe('validateInclusion', () => {
  describe("when specify 'in' option", () => {
    describe('when return errors', () => {
      describe("when 'propVal' is not excluded 'list' (when string)", () => {
        const errors = validateExclusion(
          'propKey',
          'propVal',
          { in: ['propVal', 'propVal_1'] },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@rue/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EXCLUDED);
          expect(errors[0].message).toEqual(
            '\'test.propKey\' is not excluded in the \'["propVal","propVal_1"]\'.'
          );
        });
      });

      describe("when 'propVal' is not excluded 'list' (when number)", () => {
        const errors = validateExclusion('propKey', 1, { in: [1, 2] }, translate) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@rue/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EXCLUDED);
          expect(errors[0].message).toEqual("'test.propKey' is not excluded in the '[1,2]'.");
        });
      });

      describe("when 'propVal' is not excluded 'list' (when boolean)", () => {
        const errors = validateExclusion(
          'propKey',
          true,
          { in: [true, false] },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@rue/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EXCLUDED);
          expect(errors[0].message).toEqual(
            "'test.propKey' is not excluded in the '[true,false]'."
          );
        });
      });

      describe("when 'propVal' is not excluded 'list' (when undefined)", () => {
        const errors = validateExclusion(
          'propKey',
          undefined,
          { in: [undefined] },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@rue/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EXCLUDED);
          expect(errors[0].message).toEqual(
            "'test.propKey' is not excluded in the '[\"undefined\"]'."
          );
        });
      });

      describe("when 'propVal' is not excluded 'list' (when null)", () => {
        const errors = validateExclusion('propKey', null, { in: [null] }, translate) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@rue/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EXCLUDED);
          expect(errors[0].message).toEqual("'test.propKey' is not excluded in the '[null]'.");
        });
      });

      describe("when 'propVal' is not excluded 'list' (when mix)", () => {
        const errors = validateExclusion(
          'propKey',
          'propVal',
          { in: ['propVal', 1, true, false, undefined, null] },
          translate
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@rue/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EXCLUDED);
          expect(errors[0].message).toEqual(
            '\'test.propKey\' is not excluded in the \'["propVal",1,true,false,"undefined",null]\'.'
          );
        });
      });

      describe("when 'propVal' is not excluded 'list' (when mix / override message)", () => {
        const errors = validateExclusion(
          'propKey',
          'propVal',
          { in: ['propVal', 1, true, false, undefined, null] },
          translate,
          'override message'
        ) as et.ErrObj[];
        it('return errors', () => {
          expect(errors[0].namespace).toEqual('@rue/activemodel');
          expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_EXCLUDED);
          expect(errors[0].message).toEqual('override message');
        });
      });
    });

    describe('when reurn true', () => {
      describe("when 'propVal' is not excluded 'list' (when string)", () => {
        const result = validateExclusion(
          'propKey',
          'propVal',
          { in: ['propVal_1', 'propVal_2'] },
          translate
        ) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });

      describe("when 'propVal' is not excluded 'list' (when number)", () => {
        const result = validateExclusion('propKey', 1, { in: [2, 3] }, translate) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });

      describe("when 'propVal' is not excluded 'list' (when boolean)", () => {
        const result = validateExclusion(
          'propKey',
          'propVal',
          { in: [true, false] },
          translate
        ) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });

      describe("when 'propVal' is not excluded 'list' (when undefined)", () => {
        const result = validateExclusion(
          'propKey',
          'propVal',
          { in: [undefined] },
          translate
        ) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });

      describe("when 'propVal' is not excluded 'list' (when null)", () => {
        const result = validateExclusion(
          'propKey',
          'propVal',
          { in: [null] },
          translate
        ) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });

      describe("when 'propVal' is not excluded 'list' (when mix)", () => {
        const result = validateExclusion(
          'propKey',
          'propVal',
          { in: ['propVal_1', 1, true, false, undefined, null] },
          translate
        ) as et.ErrObj[];
        it('return true', () => {
          expect(result).toEqual(true);
        });
      });
    });
  });
});
