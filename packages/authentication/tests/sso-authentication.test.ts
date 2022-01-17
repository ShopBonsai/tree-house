import { Algorithm } from 'jsonwebtoken';
import jwksClient = require('jwks-rsa');

import { createJwt, getKey } from '../src';

const validJwtConfiguration = {
  algorithm: 'HS256' as Algorithm,
  expiresIn: '10m',
  audience: 'TREEHOUSE-AUTH',
  issuer: 'https://test.com/id/oauth2',
  secretOrKey: '5kZxE|gZu1ODB183s772)/3:l_#5hU3Gn5O|2ux3&lhN@LQ6g+"i$zqB_C<6',
};

// Mock jwks-rsa module
jest.genMockFromModule('jwks-rsa');
jest.mock('jwks-rsa');

const mockJwksClient = {
  getSigningKey: jest.fn((_token) => Promise.resolve({ getPublicKey: () =>'publicKey' })),
  getKeys: jest.fn(),
  getSigningKeys: jest.fn(),
};

(jwksClient as unknown as jest.Mock).mockImplementation(() => mockJwksClient);

let token: any = null;

describe('#SSO authentication', () => {
  beforeAll(async () => {
    token = await createJwt({ sub: 'FakeUser' }, validJwtConfiguration);
  });

  describe('getKey', () => {
    it('Should return the signing key of the token', async () => {
      const signedPublicKey = await getKey(validJwtConfiguration.issuer, token);
      expect(signedPublicKey).toEqual('publicKey');
    });

    it('Should throw an error', async () => {
      mockJwksClient.getSigningKey.mockImplementation((_token) => Promise.reject(new Error('Something went wrong')));
      try {
        await getKey(validJwtConfiguration.issuer, token);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('Something went wrong');
      }
    });
  });

  describe('authenticateSso', () => {
    // TODO
  });
});
