import express from 'express';
import { startServer } from '../lib/server';
import { defaultHealthCheck } from '../config/defaults';

const app = express();

console.log('Server with a basic enabled health check');
startServer(app, {
  port: 4999,
  healthCheck: {
    enabled: true,
  },
});
// {"status":"ok"}

console.log('Server with a disabled health check');
startServer(app, {
  port: 4998,
  healthCheck: {
    enabled: false,
  },
});
// 404

console.log('Server with a custom enabled health check with a custom path `healthz` with no details');
startServer(app, {
  port: 4997,
  terminusOptions: {
    healthChecks: defaultHealthCheck({
      '/healthz': () => Promise.resolve(),
    }),
  },
});
// {"status":"ok"}

console.log('Server with a custom enabled health check with a custom path `healthz` with details');
startServer(app, {
  port: 4996,
  terminusOptions: {
    healthChecks: defaultHealthCheck({
      '/healthz': () => Promise.resolve({ health: 'check' }),
      isProduction: false,
    }),
  },
});
// {"status":"ok","info":{"health":"check"},"details":{"health":"check"}}

console.log('Server with a custom enabled health check with a custom path `healthz` in production mode with details - hides the traces');
startServer(app, {
  port: 4995,
  terminusOptions: {
    healthChecks: defaultHealthCheck({
      '/healthz': () => Promise.resolve({ health: 'check' }),
      isProduction: true,
    }),
  },
});
// {"status":"ok","health":"check"}

console.log('Server with enabled healthcheck & with a custom terminus `healthz` healthcheck in production mode with details');
startServer(app, {
  port: 4994,
  healthCheck: {
    enabled: true,
  },
  terminusOptions: {
    healthChecks: defaultHealthCheck({
      '/healthz': () => Promise.resolve({ health: 'check' }),
      isProduction: true,
    }),
  },
});
// /healthcheck > {"status":"ok","health":"check"}
// /healthz > 404
