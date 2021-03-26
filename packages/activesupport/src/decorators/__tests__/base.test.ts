import { RueClassName } from '../index';

describe('Decorator', () => {
  describe('RueClassName', () => {
    @RueClassName('Record')
    class Decorator {}

    it('shoulld correctly', () => {
      expect(Decorator.name).toEqual('Record');
      expect(new Decorator().constructor.name).toEqual('Record');
    });

    it('throw error', () => {
      try {
        @RueClassName('Record')
        class ThrowErrorRecord {}
      } catch (err) {
        expect(err.toString()).toEqual(
          "'Record' is a klassName that is already in use. Please use another name"
        );
      }
    });
  });
});
