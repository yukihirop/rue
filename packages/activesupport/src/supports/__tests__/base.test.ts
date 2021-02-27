import { ActiveSupport$Base as Support } from '@/supports';

describe('Support', () => {
  describe('#inspect', () => {
    type TestInspectParams = {
      profile: {
        name: string;
        age: number;
      };
    };
    class TestInspectSupport {
      public profile: TestInspectParams['profile'];

      constructor(data: TestInspectParams) {
        this.profile = {
          name: data.profile.name,
          age: data.profile.age,
        };
      }
    }

    describe('when default', () => {
      const instance = new TestInspectSupport({ profile: { name: 'name_3', age: 30 } });
      it('should correctly', () => {
        const expected = `TestInspectSupport {
  "profile": {
    "name": "name_3",
    "age": 30
  }
}`;
        expect(Support.inspect(instance)).toEqual(expected);
      });
    });
  });
});
