// locals
import { RueCheck } from '../base';
import { ActiveModel$Base as Model } from '@/models';

// types
import type * as lt from '@/locales';

describe('Decorator', () => {
  describe('RueCheck', () => {
    describe('when success', () => {
      it('should correctly', () => {
        expect(() => {
          @RueCheck()
          class RueCheckModel extends Model {
            get uniqueKey(): string {
              return 'RueCheckModel';
            }

            static i18nConfig(): lt.I18nConfig {
              return {
                options: {
                  lng: 'en',
                },
              };
            }
          }
        }).not.toThrowError();
      });

      it('should set prototype property', () => {
        @RueCheck()
        class RueCheckModel extends Model {
          get uniqueKey(): string {
            return 'RueCheckGetterModel';
          }

          static i18nConfig(): lt.I18nConfig {
            return {
              options: {
                lng: 'en',
              },
            };
          }
        }
        expect(RueCheckModel.prototype['__rue_uniqueKey__']).toEqual('RueCheckGetterModel');
        expect(RueCheckModel.uniqueKey).toEqual('RueCheckGetterModel');
        expect(new RueCheckModel().uniqueKey).toEqual('RueCheckGetterModel');
      });
    });

    describe('when throw errors', () => {
      describe("when do not override 'translate' or 'uniqueKey'", () => {
        it('should correctly', () => {
          expect(() => {
            @RueCheck()
            class RueCheckModel extends Model {}
          }).toThrowError("Please implement '[static] uniqueKey(): string' in Inherited Class.");
        });
      });

      describe("when do not override 'uniqueKey'", () => {
        it('should correctly', () => {
          expect(() => {
            @RueCheck()
            class RueCheckModel extends Model {
              static translate(key: string, otps?: string): string {
                return key;
              }
            }
          }).toThrowError("Please implement '[static] uniqueKey(): string' in Inherited Class.");
        });
      });
    });
  });
});
