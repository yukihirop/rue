import { humanPropertyName } from '../translation';

const translate = (key: string) => `test.${key}`;

describe('Translation', () => {
  it('should correctly', () => {
    const result = humanPropertyName('propKey', translate);
    expect(result).toEqual('test.propKey');
  });
});
