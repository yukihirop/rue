// singletonns
import { Rue } from '../base';

// types
import type * as t from '../types';

describe('Rue', () => {
  describe('#config', () => {
    describe('when success', () => {
      const data = {
        i18n: {
          options: {
            lng: 'ja',
            fallbackLng: 'en',
          },
          resources: {
            ja: {
              name: '名前',
              age: '年齢',
            },
            en: {
              name: '名前',
              age: '年齢',
            },
          },
        },
      } as t.RueRuntimeConfig;
      it('should correctly', () => {
        Rue.configure(data);
        expect(Rue.i18n).toEqual({
          options: { fallbackLng: 'en', lng: 'ja' },
          resources: { en: { age: '年齢', name: '名前' }, ja: { age: '年齢', name: '名前' } },
        });
      });
    });

    describe('when failure', () => {
      // @ts-expect-error
      const data = {
        i18n: {
          options: {
            lng: 'invalid',
            fallbackLng: 'invalid',
          },
          resources: {
            ja: {
              name: '名前',
              age: '年齢',
            },
            en: {
              name: '名前',
              age: '年齢',
            },
          },
        },
      } as t.RueRuntimeConfig;
      it('should correctly', () => {
        expect(() => {
          Rue.configure(data);
        }).toThrowError(
          "Rue Runtime Config is invalid. 'i18n.options.lng' must be included in [ja, en]"
        );
      });
    });
  });
});
