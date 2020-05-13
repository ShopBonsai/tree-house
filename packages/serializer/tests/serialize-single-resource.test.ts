import { Serializer } from '../src';

describe('Serializer single resource', () => {
  test('should serialize a flat dataset', async () => {
    // raw data
    const rawData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 27,
    };

    // serializer definition
    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'gender'],
    });

    const result = await userSerializer.serialize(rawData);
    const { meta, data } = result;

    expect(meta.type).toEqual('user');
    expect(data).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      gender: null,
    });
  });

  test('should serialize a nested object', async () => {
    // raw data
    const rawData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 27,
      address: {
        street: 'Markt',
        number: '100',
        city: 'Zonnedorp',
        country: 'Belgium',
      },
    };

    // serializer definition
    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'address'],
      address: {
        attributes: ['street', 'number'],
      },
    });

    const result = await userSerializer.serialize(rawData);
    const { meta, data } = result;

    expect(meta.type).toEqual('user');
    expect(data).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      address: {
        street: 'Markt',
        number: '100',
      },
    });
  });

  test('should serialize a nested array', async () => {
    // raw data
    const rawData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 27,
      hobbies: [
        { id: 1, name: 'Bowling', description: 'sport & stuff' },
        { id: 2, name: 'Reading', type: 'read & stuff' },
        { id: 3, name: 'Gardening', type: 'plants & stuff' },
      ],
    };

    // serializer definition
    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'hobbies'],
      hobbies: {
        attributes: ['name'],
      },
    });

    const result = await userSerializer.serialize(rawData);
    const { meta, data } = result;

    expect(meta.type).toEqual('user');
    expect(data).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      hobbies: [
        { name: 'Bowling' },
        { name: 'Reading' },
        { name: 'Gardening' },
      ],
    });
  });

  test('should serialize a property with a custom function', async () => {
    // raw data
    const rawData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 27,
      address: {
        street: 'Markt',
        number: '100',
        city: 'Zonnedorp',
        country: 'Belgium',
      },
      hobbies: [
        { id: 1, name: 'Bowling', description: 'sport & stuff' },
        { id: 2, name: 'Reading', type: 'read & stuff' },
        { id: 3, name: 'Gardening', type: 'plants & stuff' },
      ],
    };

    // serializer definition
    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'age', 'hobbies', 'address'],
      address: (v: any) => `${v.street} ${v.number}, ${v.city}, ${v.country}`,
      age: (val: any) => `${val} years old`,
      hobbies: (values: any) => (
        values.map((v: any) => v.name)
      ),
    });

    const result = await userSerializer.serialize(rawData);
    const { meta, data } = result;

    expect(meta.type).toEqual('user');
    expect(data).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      age: '27 years old',
      address: 'Markt 100, Zonnedorp, Belgium',
      hobbies: ['Bowling', 'Reading', 'Gardening'],
    });
  });

  test('should serialize a property with a custom asynchronous function', async () => {
    // raw data
    const rawData = {
      firstName: 'John',
      lastName: 'Doe',
    };

    const asyncOperation = () => new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve('my result');
      }, 1500);
    });

    // serializer definition
    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'hobbies', 'address', 'age'],
      age: async () => await asyncOperation(),
    });

    const result = await userSerializer.serialize(rawData);
    const { meta, data } = result;

    expect(meta.type).toEqual('user');
    expect(data.age).toEqual('my result');
  });

  test('should serialize a property with a custom function using the data parameter', async () => {
    // raw data
    const rawData = {
      id: 1234,
    };

    // serializer definition
    const idSerializer = new Serializer('user', {
      attributes: ['userId'],
      userId: (_val: any, data: any) => data.id,
    });

    const result = await idSerializer.serialize(rawData);
    const { meta, data } = result;

    expect(meta.type).toEqual('user');
    expect(data).toEqual({
      userId: rawData.id,
    });
  });

  test('should serialize an atomic array', async () => {
    // raw data
    const rawData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 27,
      hobbies: ['Bowling', 'Reading', 'Gardening'],
    };

    // serializer definition
    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'hobbies'],
    });

    const result = await userSerializer.serialize(rawData);
    const { meta, data } = result;

    expect(meta.type).toEqual('user');
    expect(data).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      hobbies: ['Bowling', 'Reading', 'Gardening'],
    });
  });

  test('should serialize a plain object', async () => {
    // raw data
    const rawData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 27,
      children: {
        oldest: 'Brent',
      },
    };

    // serializer definition
    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'children'],
    });

    const result = await userSerializer.serialize(rawData);
    const { meta, data } = result;
    expect(meta.type).toEqual('user');
    expect(data).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      children: {
        oldest: 'Brent',
      },
    });
  });
});
