import { ENV } from './constants';

class ServiceContext {

  static instance: ServiceContext;
  private name: string;
  private version: string;
  private traceIdPrefix: string;

  private constructor({ name, version, traceIdPrefix }: { name: string, version: string, traceIdPrefix: string }) {
    this.name = name;
    this.version = version;
    this.traceIdPrefix = traceIdPrefix;
  }

  public static getInstance(): ServiceContext {
    if (!ServiceContext.instance) {
      ServiceContext.instance = new ServiceContext({
        name: ENV.serviceName,
        version: ENV.serviceVersion,
        traceIdPrefix: '',
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
   * Returns trace ID prefix,
   * @returns {string} Trace ID prefix.
   */
  public getTraceIdPrefix() {
    return this.traceIdPrefix;
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

  /**
   * Sets trace ID prefix.
   * @param {string} traceIdPrefix- Trace ID prefix.
   */
  public setTraceIdPrefix(traceIdPrefix?: string) {
    this.traceIdPrefix = traceIdPrefix || '';
  }
}

export const serviceContext = ServiceContext.getInstance();
