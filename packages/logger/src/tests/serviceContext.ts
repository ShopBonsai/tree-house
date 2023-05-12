import { faker } from '@faker-js/faker';
import { ENV } from '../constants';
import { serviceContext } from '../serviceContext';

describe('serviceContext', () => {
  describe('getName', () => {

    it('Should output default service name', () => {
      const result = serviceContext.getName();

      expect(result).toBe(ENV.serviceName);
    });

    it('Should output updated service name', () => {
      const name = faker.string.alpha();
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
      const version = faker.string.alphanumeric();
      serviceContext.setVersion(version);
      const result = serviceContext.getVersion();

      expect(result).toBe(version);
    });
  });
});
