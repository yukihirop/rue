import { validate as validateFormat } from '../format';
import { ErrCodes } from '@/errors';

// types
import type * as et from '@/errors';

const translate = (key: string) => `test.${key}`;

describe('validateFormat', () => {
  describe('when return errors', () => {
    describe("when specify 'with' (when email)", () => {
      const errors = validateFormat(
        'propKey',
        'propVal',
        { with: 'email' },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_FORMAT);
        expect(errors[0].message).toEqual("'test.propKey' do not meet the format: 'email'.");
      });
    });

    describe("when specify 'with' (when IPv4)", () => {
      const errors = validateFormat(
        'propKey',
        'propVal',
        {
          with: 'IPv4',
        },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_FORMAT);
        expect(errors[0].message).toEqual("'test.propKey' do not meet the format: 'IPv4'.");
      });
    });

    describe("when specify 'with' (when IPv6)", () => {
      const errors = validateFormat(
        'propKey',
        'propVal',
        {
          with: 'IPv6',
        },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_FORMAT);
        expect(errors[0].message).toEqual("'test.propKey' do not meet the format: 'IPv6'.");
      });
    });

    describe("when specify 'with' (when custom)", () => {
      const errors = validateFormat(
        'propKey',
        'propVal',
        {
          with: /\d+/,
        },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_FORMAT);
        expect(errors[0].message).toEqual("'test.propKey' do not meet the format: '/\\d+/'.");
      });
    });

    describe("when specify 'with' (when custom/override message)", () => {
      const errors = validateFormat(
        'propKey',
        'propVal',
        {
          with: /\d+/,
        },
        translate,
        'override message'
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_FORMAT);
        expect(errors[0].message).toEqual('override message');
      });
    });

    describe("when 'propVal' is 'undefined'", () => {
      const errors = validateFormat(
        'propKey',
        undefined,
        {
          with: 'email',
        },
        translate
      ) as et.ErrObj[];
      it('return errors', () => {
        expect(errors[0].namespace).toEqual('@rue/activemodel');
        expect(errors[0].code).toEqual(ErrCodes.PROPERTY_DO_NOT_MEET_THE_FORMAT);
        expect(errors[0].message).toEqual("'test.propKey' do not meet the format: 'email'.");
      });
    });
  });

  describe('when return true', () => {
    describe("when specify 'with' (when email)", () => {
      const result = validateFormat(
        'propKey',
        'propVal@test.com',
        { with: 'email' },
        translate
      ) as boolean;
      it('return errors', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'with' (when IPv4)", () => {
      const result = validateFormat(
        'propKey',
        '191.255.255.255',
        { with: 'IPv4' },
        translate
      ) as boolean;
      it('return errors', () => {
        expect(result).toEqual(true);
      });
    });

    describe("when specify 'with' (when IPv6)", () => {
      const result = validateFormat(
        'propKey',
        '2001:0db8:1234:5678:90ab:cdef:0000:0000',
        { with: 'IPv6' },
        translate
      ) as boolean;
      it('return errors', () => {
        expect(result).toEqual(true);
      });
    });
  });
});
