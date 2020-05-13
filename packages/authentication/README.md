# Tree House Authentication

Authentication module written in TypeScript providing authentication utilities and JWT methods.

## Installation

Install via npm

```shell
npm install @tree-house/authentication
```

or via yarn

```shell
yarn add @tree-house/authentication
```

## Usage

```javascript
const authenticator = require('@tree-house/authentication')
```

```javascript
import * as authenticator from '@tree-house/authentication'
```

## JWT

### Configuration

```javascript
const jwtSettings = {
  algorithm: 'HS256',
  expiresIn: '7d',
  audience: 'TREEHOUSE-AUTH',
  issuer: 'treehouse-authentication',
  secretOrKey: '5kZxE|gZu1ODB183s772)/3:l_#5hU3Gn5O|2ux3&lhN@LQ6g+"i$zqB_C<6',
};
```

> You can find all possible configuration options at [Github: node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

### createJwt(payload, jwtSettings)

Returns a json webtoken with the provided payload and configuration. (**Asynchronous**)

### authenticateJwt(token, jwtSettings)

Returns a decoded jwt token when the provided token is still valid. (**Asynchronous**)

### decodeJwt(token)

Returns a decoded json webtoken. This does not validate the token. (**Synchronous**)

## Sessions

### getSession(options)

Returns an express middleware function to use on session based routes using the `express-session` module. (**Synchronous**)

```javascript
const app = express();

const session = getSession({
  secret: 'mySuperSecretSecret'
});

app.use(session);
```

- [All available express-session options](https://github.com/expressjs/session)

## Two-factor authentication

Two-factor authentication functions using the `speakeasy` module.

### generate2FAKey(options)

Returns two-factor authentication key with base32 and otp-authentication url needed for QR code generation

```javascript
const { otpauth_url, base32, ... } = generate2FAKey();
```

- [All available speakeasy options](https://github.com/speakeasyjs/speakeasy)

### generateQrCode(options)

Returns QR code image data, user secret, and url (if you wish to have a custom qr code implementation)

```javascript
const { imageData, secret, url } = generateQrCode(options);
```

- [All available speakeasy options](https://github.com/speakeasyjs/speakeasy)

### verifyToken(secret, token)

Verify whether a token is valid depending on a provided user secret (returns true/false)

```javascript
const isValidCode = verifyToken('userSecret', 021214);
```

## Utilities

### generateRandomHash(algorithm (optional), secret (optional))

Returns a random hash (can be used for tokens) (**Synchronous**)

### getHashedPassword(password, saltCount)

Returns a hashed password. (**Asynchronous**)

### comparePassword(password, hashedPw)

Check whether a password is valid compared with a hashed password. (**Asynchronous**)

### hashPassword(password, options = { algorithm, key, iv})

Hash a password. (**Asynchronous**)

### dehashPassword(password, options = { algorithm, key, iv})

Dehash a password. (**Asynchronous**)

## Tests

  You can run `npm run test` to run all tests
  You can run `npm run test:coverage` to run all tests with coverage report

## Bugs

When you find issues, please report them:

- web: [https://github.com/knor-el-snor/tree-house/issues](https://github.com/knor-el-snor/tree-house/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/knor-el-snor/tree-house/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
