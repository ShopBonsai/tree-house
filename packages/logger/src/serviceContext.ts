import { ENV } from './constants';

class ServiceContext {

  static instance: ServiceContext;
  private name: string;
  private version: string;

  private constructor({ name, version }: { name: string, version: string }) {
    this.name = name;
    this.version = version;
  }

  public static getInstance(): ServiceContext {
    if (!ServiceContext.instance) {
      ServiceContext.instance = new ServiceContext({
        name: ENV.serviceName,
        version: ENV.serviceVersion,
      });
    }
    return ServiceContext.instance;
  }

  /**
   * Returns service name.
   * @returns {string} Service name.
   */
  public getName() {
    return this.name;
  }

  /**
   * Returns service version.
   * @returns {string} Service version.
   */
  public getVersion() {
    return this.version;
  }

  /**
   * Sets service name.
   * @param {string} name- Service name.
   */
  public setName(name: string) {
    this.name = name;
  }

  /**
   * Sets service version.
   * @param {string} version- Service version.
   */
  public setVersion(version: string) {
    this.version = version;
  }
}

export const serviceContext = ServiceContext.getInstance();
