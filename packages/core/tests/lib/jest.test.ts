import { enableCustomMatchers } from '../..';

describe('Jest', () => {
  // Must still be imported to make them actually available
  enableCustomMatchers();

  it('Should match when object is in array', () => {
    const myArray = [{ key: '12', value: 'coolValue' }];
    expect(myArray).toMatchObjectInArray({
      key: '12',
      value: 'coolValue',
    });
  });
});
