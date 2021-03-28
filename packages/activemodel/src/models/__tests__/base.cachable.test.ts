// locals
import { ActiveModel$Base as Model } from '../base';

describe('ActiveModel$Base (ActiveModel$Cachable)', () => {
  describe('[getter] uniqueKey', () => {
    describe('when default (throw error)', () => {
      class CachableModdel extends Model {}
      it('should correctly', () => {
        expect(() => {
          CachableModdel.uniqueKey;
        }).toThrowError("Please implement '[static] uniqueKey(): string' in Inherited Class.");
      });
    });

    describe('when override', () => {
      class CachableModdel extends Model {
        get uniqueKey(): string {
          return 'CachableModdel';
        }
      }
      it('should correctly', () => {
        expect(CachableModdel.uniqueKey).toEqual('CachableModdel');
        expect(new CachableModdel().uniqueKey).toEqual('CachableModdel');
      });
    });
  });

  describe('[static] checkUniqueKey', () => {
    describe('when default (throw error)', () => {
      class CachableModdel extends Model {}
      it('should correctly', () => {
        expect(() => {
          // @ts-expect-error
          CachableModdel.checkUniqueKey();
        }).toThrowError("Please implement '[static] uniqueKey(): string' in Inherited Class.");
      });
    });

    describe('when override (return true)', () => {
      class CachableModdel extends Model {
        get uniqueKey(): string {
          return `CachableModdel`;
        }
      }
      it('should correctly', () => {
        // @ts-expect-error
        expect(CachableModdel.checkUniqueKey()).toEqual(true);
      });
    });

    describe('when duplicated uniqueKey (throw error)', () => {
      class CachableModdel extends Model {
        get uniqueKey(): string {
          return `CachableModdel`;
        }
      }
      class CachableChildModdel extends Model {
        get uniqueKey(): string {
          return `CachableModdel`;
        }
      }
      it('should correctly', () => {
        try {
          // @ts-expect-error
          CachableModdel.checkUniqueKey();
          // @ts-expect-error
          CachableChildModdel.checkUniqueKey();
        } catch (err) {
          expect(err.toString()).toEqual(
            "'CachableModdel' is a uniqueKey that is already in use. Please use another name"
          );
        }
      });
    });
  });
});
