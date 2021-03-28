// locals
import { ActiveModel$Base as Model } from '../base';

describe('ActiveModel$Base (ActiveModel$MinifyMeasures)', () => {
  describe('[getter] uniqueKey', () => {
    describe('when default (throw error)', () => {
      class MinifyMeasuresModdel extends Model {}
      it('should correctly', () => {
        expect(() => {
          MinifyMeasuresModdel.uniqueKey;
        }).toThrowError("Please implement '[static] uniqueKey(): string' in Inherited Class.");
      });
    });

    describe('when override', () => {
      class MinifyMeasuresModdel extends Model {
        get uniqueKey(): string {
          return 'MinifyMeasuresModdel';
        }
      }
      it('should correctly', () => {
        expect(MinifyMeasuresModdel.uniqueKey).toEqual('MinifyMeasuresModdel');
        expect(new MinifyMeasuresModdel().uniqueKey).toEqual('MinifyMeasuresModdel');
      });
    });
  });

  describe('[static] checkUniqueKey', () => {
    describe('when default (throw error)', () => {
      class MinifyMeasuresModdel extends Model {}
      it('should correctly', () => {
        expect(() => {
          // @ts-expect-error
          MinifyMeasuresModdel.checkUniqueKey();
        }).toThrowError("Please implement '[static] uniqueKey(): string' in Inherited Class.");
      });
    });

    describe('when override (return true)', () => {
      class MinifyMeasuresModdel extends Model {
        get uniqueKey(): string {
          return `MinifyMeasuresModdel`;
        }
      }
      it('should correctly', () => {
        // @ts-expect-error
        expect(MinifyMeasuresModdel.checkUniqueKey()).toEqual(true);
      });
    });

    describe('when duplicated uniqueKey (throw error)', () => {
      class MinifyMeasuresModdel extends Model {
        get uniqueKey(): string {
          return `MinifyMeasuresModdel`;
        }
      }
      class MinifyMeasuresChildModdel extends Model {
        get uniqueKey(): string {
          return `MinifyMeasuresModdel`;
        }
      }
      it('should correctly', () => {
        try {
          // @ts-expect-error
          MinifyMeasuresModdel.checkUniqueKey();
          // @ts-expect-error
          MinifyMeasuresChildModdel.checkUniqueKey();
        } catch (err) {
          expect(err.toString()).toEqual(
            "'MinifyMeasuresModdel' is a uniqueKey that is already in use. Please use another name"
          );
        }
      });
    });
  });
});
