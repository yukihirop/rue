import { validate as validatePresence } from '../presence';
import { ErrCodes } from '@/errors';

// types
import type * as et from '@/errors';

const translate = (key: string) => `test.${key}`;

describe('validatePresence', () => {
  describe('when return errors', () => {
    describe("when 'propVal' is 'boolean (false)'", () => {
      const errors = validatePresence('propKey', false, true, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_PRESENCE);
        expect(errors[0].message).toEqual("'test.propKey' can't be empty.");
      });
    });

    describe("when 'propVal' is 'undefined'", () => {
      const errors = validatePresence('propKey', undefined, true, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_PRESENCE);
        expect(errors[0].message).toEqual("'test.propKey' can't be empty.");
      });
    });

    describe("when 'propVal' is 'null'", () => {
      const errors = validatePresence('propKey', null, true, translate) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_PRESENCE);
        expect(errors[0].message).toEqual("'test.propKey' can't be empty.");
      });
    });

    describe("when 'propVal' is 'null / override message'", () => {
      const errors = validatePresence(
        'propKey',
        null,
        true,
        translate,
        'override message'
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_IS_NOT_PRESENCE);
        expect(errors[0].message).toEqual('override message');
      });
    });
  });

  describe('when return true', () => {
    describe("when 'propVal' is 'string (empty)'", () => {
      const result = validatePresence('propKey', '', true, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'string (not empty)'", () => {
      const result = validatePresence('propKey', 'propVal', true, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'number (0)'", () => {
      const result = validatePresence('propKey', 0, true, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'boolean (true)'", () => {
      const result = validatePresence('propKey', true, true, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'array (empty)'", () => {
      const result = validatePresence('propKey', [], true, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'array (not empty)'", () => {
      const result = validatePresence('propKey', ['propVal'], true, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'object (empty)'", () => {
      const result = validatePresence('propKey', {}, true, translate) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when 'propVal' is 'object (not empty)'", () => {
      const result = validatePresence(
        'propKey',
        { propVal: 'propVal' },
        true,
        translate
      ) as boolean;
      it('return true', () => {
        expect(result).toEqual(true);
      });
    });
  });
});
