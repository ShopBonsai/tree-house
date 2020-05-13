import { Serializer } from '../src';

describe('Serializer multiple resource', () => {
  test('should serialize a flat dataset', async () => {
    // raw data
    const rawData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        age: 27,
      },
      {
        firstName: 'Jessie',
        lastName: 'Doe',
        age: 26,
      },
    ];

    // serializer definition
    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName'],
    });

    const result = await userSerializer.serialize(rawData, { totalCount: 11 });
    const { meta, data } = result;

    expect(meta).toEqual({
      type: 'user',
      count: 2,
      totalCount: 11,
    });

    expect(data).toEqual([
      {
        firstName: 'John',
        lastName: 'Doe',
      }, {
        firstName: 'Jessie',
        lastName: 'Doe',
      },
    ]);
  });

  test('should serialize a nested object', async () => {
    // raw data
    const rawData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        age: 27,
        address: {
          street: 'Markt',
          number: '100',
          city: 'Zonnedorp',
          country: 'Belgium',
        },
      },
    ];

    // serializer definition
    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'address'],
      address: {
        attributes: ['street', 'number'],
      },
    });

    const result = await userSerializer.serialize(rawData, { totalCount: 11 });
    const { meta, data } = result;

    expect(meta).toEqual({
      type: 'user',
      count: 1,
      totalCount: 11,
    });

    expect(data).toEqual([
      {
        firstName: 'John',
        lastName: 'Doe',
        address: {
          street: 'Markt',
          number: '100',
        },
      },
    ]);
  });

  test('should serialize a nested array', async () => {
    // raw data
    const rawData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        age: 27,
        hobbies: [
          { id: 1, name: 'Bowling', description: 'sport & stuff' },
          { id: 2, name: 'Reading', type: 'read & stuff' },
          { id: 3, name: 'Gardening', type: 'plants & stuff' },
        ],
      },
    ];

    // serializer definition
    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'hobbies'],
      hobbies: {
        attributes: ['name'],
      },
    });

    const result = await userSerializer.serialize(rawData, { totalCount: 11 });
    const { meta, data } = result;

    expect(meta).toEqual({
      type: 'user',
      count: 1,
      totalCount: 11,
    });

    expect(data).toEqual([
      {
        firstName: 'John',
        lastName: 'Doe',
        hobbies: [
          { name: 'Bowling' },
          { name: 'Reading' },
          { name: 'Gardening' },
        ],
      },
    ]);
  });
});
