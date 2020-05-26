import {
  sign as jwtSign,
  verify as jwtVerify,
  decode as jwtDecode,
  Secret,
  SignOptions,
  DecodeOptions,
  VerifyOptions,
} from 'jsonwebtoken';
import { DEFAULT_JWT_CONFIG, DEFAULT_JWT_DECODE_OPTIONS } from '../config/jwt.config';

/**
 * Create a JWT token
 */
export const createJwt = (payload: Object, options: CustomSignOptions = DEFAULT_JWT_CONFIG): Promise<string> => {
  const { secretOrKey, ...otherOptions } = options;
  return signJwt(payload, secretOrKey, otherOptions);
};

/**
 * Decode a json webtoken without validation
 */
export const decodeJwt = (
  token: string,
  options: DecodeOptions = DEFAULT_JWT_DECODE_OPTIONS,
): null | { [key: string]: any } | string => jwtDecode(token, options);

/**
 * Sign a new json webtoken
 */
const signJwt = (payload: Object, secretOrKey: Secret, jwtSettings: SignOptions): Promise<string> =>
  new Promise((resolve, reject) => {
    jwtSign(payload, secretOrKey, jwtSettings, (error, jwtToken) => {
      if (error) reject(`Something went wrong trying to create a json webtoken. Actual error: ${error}`);
      resolve(jwtToken);
    });
  });

/**
 * Verify whether the provided jwt token is valid and return decoded information
 */
export const verifyJwt = (
  token: string,
  jwtSettings: VerifyOptions & { secretOrKey: string | Buffer } = DEFAULT_JWT_CONFIG,
): Promise<object> =>
  new Promise((resolve, reject) => {
    if (token === '') return reject(new Error('JWT token is empty.'));
    const { secretOrKey, ...otherSettings } = jwtSettings;
    jwtVerify(token, secretOrKey, otherSettings, (error, decoded) => {
      if (error) reject(`Something went wrong trying to verify the json webtoken. Actual error: ${error}`);
      resolve(decoded);
    });
  });

// Interfaces
export interface CustomSignOptions extends SignOptions {
  secretOrKey: string;
}
