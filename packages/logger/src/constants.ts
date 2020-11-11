export const ENV = {
  serviceName: process.env.npm_package_name,
  serviceVersion: process.env.npm_package_version,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'debug',
};
