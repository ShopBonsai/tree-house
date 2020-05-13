import { Serializer } from '../src';

describe('Nested serializer', () => {
  test('should succesfully use a nested serializer', async () => {
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
    const addressSerializer = new Serializer('address', {
      attributes: ['street', 'number'],
    });

    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'address'],
      address: addressSerializer,
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

  test('should succesfully use a nested serializer on a list of data', async () => {
    // raw data
    const rawData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 27,
      address: [
        {
          street: 'Markt',
          number: '100',
          city: 'Zonnedorp',
          country: 'Belgium',
        }, {
          street: 'Kerkstraat',
          number: '69',
          city: 'Zonnedorp',
          country: 'Belgium',
        },
      ],
      contactInfo: null as any,
    };

    // serializer definition
    const addressSerializer = new Serializer('address', {
      attributes: ['street', 'number'],
    });

    const contactInfoSerializer = new Serializer('contactInfo', {
      attributes: ['phoneNumber', 'email', 'skype'],
    });

    const userSerializer = new Serializer('user', {
      attributes: ['firstName', 'lastName', 'address', 'contactInfo'],
      address: addressSerializer,
      contactInfo: contactInfoSerializer,
    });

    const result = await userSerializer.serialize(rawData);
    const { meta, data } = result;

    expect(meta.type).toEqual('user');
    expect(data).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      address: [
        {
          street: 'Markt',
          number: '100',
        }, {
          street: 'Kerkstraat',
          number: '69',
        },
      ],
      contactInfo: null,
    });
  });
});
