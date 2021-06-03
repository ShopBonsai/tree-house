import { random } from 'faker';
import { ENV } from '../constants';
import { serviceContext } from '../serviceContext';

describe('serviceContext', () => {
  describe('getName', () => {

    it('Should output default service name', () => {
      const result = serviceContext.getName();

      expect(result).toBe(ENV.serviceName);
    });

    it('Should output updated service name', () => {
      const name = random.alpha();
      serviceContext.setName(name);
      const result = serviceContext.getName();

      expect(result).toBe(name);
    });
  });

  describe('getVersion', () => {

    it('Should output default service version', () => {
      const result = serviceContext.getVersion();

      expect(result).toBe(ENV.serviceVersion);
    });

    it('Should output updated service version', () => {
      const version = random.alphaNumeric();
      serviceContext.setVersion(version);
      const result = serviceContext.getVersion();

      expect(result).toBe(version);
    });
  });
});
