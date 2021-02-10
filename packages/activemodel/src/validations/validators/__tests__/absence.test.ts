import { validate as validateAbsence } from '../absence';
import { ErrCodes } from '@/errors';

// types
import type * as et from '@/errors';

const translate = (key: string) => `test.${key}`;

describe('validateAbsence', () => {
  describe('when return errors', () => {
    describe("when 'propVal' is 'string (not empty)'", () => {
      const errors = validateAbsence('propKey', 'propVal', true, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_ABSENCE);
        expect(errors[0].message).toEqual("'test.propKey' must be blank.");
      });
    });

    describe("when 'propVal' is 'string (empty)'", () => {
      const errors = validateAbsence('propKey', '', true, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_ABSENCE);
        expect(errors[0].message).toEqual("'test.propKey' must be blank.");
      });
    });

    describe("when 'propVal' is 'array (not empty)'", () => {
      const errors = validateAbsence('propKey', ['propVal'], true, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_ABSENCE);
        expect(errors[0].message).toEqual("'test.propKey' must be blank.");
      });
    });

    describe("when 'propVal' is 'array (not empty)'", () => {
      const errors = validateAbsence('propKey', [], true, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_ABSENCE);
        expect(errors[0].message).toEqual("'test.propKey' must be blank.");
      });
    });

    describe("when 'propVal' is 'object (not empty)'", () => {
      const errors = validateAbsence(
        'propKey',
        { propVal: 'propVal' },
        true,
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_ABSENCE);
        expect(errors[0].message).toEqual("'test.propKey' must be blank.");
      });
    });

    describe("when 'propVal' is 'object (not empty)'", () => {
      const errors = validateAbsence('propKey', {}, true, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_ABSENCE);
        expect(errors[0].message).toEqual("'test.propKey' must be blank.");
      });
    });

    describe("when 'propVal' is 'object (not empty/override message)'", () => {
      const errors = validateAbsence(
        'propKey',
        { propVal: 'propVal' },
        true,
        translate,
        'override message'
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_ABSENCE);
        expect(errors[0].message).toEqual('override message');
      });
    });
  });

  describe('when return true', () => {
    describe("when 'propVal' is 'undefined'", () => {
      const result = validateAbsence('propKey', undefined, true, translate) as boolean;
      it('return errors', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'null'", () => {
      const result = validateAbsence('propKey', null, true, translate) as boolean;
      it('return errors', () => {
        expect(result).toEqual(true);
      });
    });
  });
});
