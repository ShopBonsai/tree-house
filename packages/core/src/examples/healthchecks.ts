import express from "express";
import { startServer } from "../lib/server";

const app = express()


console.log('Server with a basic enabled health check')
startServer(app, {
  port: 4999,
  healthCheck: {
    enabled: true,
  }
})

console.log('Server with a disabled health check')
startServer(app, {
  port: 4998,
  healthCheck: {
    enabled: false,
  }
})

console.log('Server with a custom enabled health check with a custom path `healthz`')
startServer(app, {
  port: 4997,
  terminusOptions: {
    healthChecks: {
      '/healthz': () => Promise.resolve()
    }
  }
})
