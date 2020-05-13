import * as root from '../src';

describe('Root module', () => {
  test('should expose a Serialize class', () => {
    expect(true).toBe(true);
    expect(root).toHaveProperty('Serializer');
  });
});
