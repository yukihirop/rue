import { RueModule } from '../base';
import { registryForRueModule as Registry } from '@/registries';

describe('RueModule', () => {
  describe('static properties', () => {
    describe('when default', () => {
      it('should correctly', () => {
        expect(RueModule.RUE_MODULE).toEqual('__rue_module__');
        expect(RueModule.RUE_ABSTRACT_CLASS).toEqual('__rue_impl_class__');
        expect(RueModule.RUE_DESCRIPTION).toEqual('__rue_description__');
        expect(RueModule.__rue_module__).toEqual(true);
        expect(RueModule.__rue_description__).toEqual(`
This is Rue Module(~ abstract class).
Run 'RueModule.prototype' or 'Object.keys(RueModule)' and so on to see more details.
It has the following as internal static properties.

・__rue_module__ = true (readonly)`);
      });
    });
  });

  describe('constructor', () => {
    it('should throw', () => {
      expect(() => {
        // @ts-ignore
        new RueModule();
      }).toThrow(
        'Could not create RueModule instance. Cause: RueModule is RueModule (~ abstract class)'
      );
    });
  });

  describe('rueModuleIncludedFrom', () => {
    describe('when included from impl class', () => {
      abstract class RueModuleIncludedFromRueModule extends RueModule {
        a(): string {
          return 'a';
        }
      }

      class RueModuleIncludedFromImpl {}

      interface RueModuleIncludedFromImpl {
        a: string;
      }

      RueModuleIncludedFromRueModule.rueModuleIncludedFrom(RueModuleIncludedFromImpl, {
        only: ['a'],
      });

      it('should correctly', () => {
        expect(
          Object.getOwnPropertyDescriptors(RueModuleIncludedFromImpl.prototype)['a']
        ).toMatchObject({ configurable: true, enumerable: true, writable: true });
        expect(
          Registry.data['RueModuleIncludedFromImpl']['__rue_ancestors__'].map((r) => r.name)
        ).toEqual(['RueModuleIncludedFromRueModule']);
      });
    });
  });

  describe('rueModuleExtendedFrom', () => {
    describe('when extended from impl class', () => {
      abstract class RueModuleExtendedFromRueModule extends RueModule {
        static a(): string {
          return 'a';
        }
      }

      class RueModuleExtendedFromImpl {}

      interface RueModuleExtendedFromImpl {
        a: string;
      }

      RueModuleExtendedFromRueModule.rueModuleExtendedFrom(RueModuleExtendedFromImpl, {
        only: ['a'],
      });

      it('should correctly', () => {
        expect(Object.getOwnPropertyDescriptors(RueModuleExtendedFromImpl)['a']).toMatchObject({
          configurable: true,
          enumerable: true,
          writable: true,
        });
        expect(
          Registry.data['RueModuleExtendedFromImpl']['__rue_ancestors__'].map((r) => r.name)
        ).toEqual(['RueModuleExtendedFromRueModule']);
      });
    });
  });
});
