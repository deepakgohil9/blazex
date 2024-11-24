import client from 'prom-client'
import responseTime from 'response-time'
import { Request, Response } from 'express'

import { normalizePath, normalizeStatusCode } from '../utils/normalizer'

client.collectDefaultMetrics()

const meterics = {
  httpRequestDuration: new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in milliseconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [50, 100, 200, 500, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 60000, 120000, 300000]
  }),
  httpRequestTotal: new client.Counter({
    name: 'http_request_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
  }),
  httpRequestSize: new client.Histogram({
    name: 'http_request_size_bytes',
    help: 'Size of HTTP requests in bytes',
    labelNames: ['method', 'route', 'status'],
  }),
  httpResponseSize: new client.Histogram({
    name: 'http_response_size_bytes',
    help: 'Size of HTTP responses in bytes',
    labelNames: ['method', 'route', 'status'],
  })
}

export const instrumentMiddleware = responseTime((req: Request, res: Response, time: number) => {
  const { method, originalUrl } = req
  const route = normalizePath(originalUrl)

  if (route === '/metrics') return

  const status = normalizeStatusCode(res.statusCode)
  const labels = { method, route, status }

  meterics.httpRequestDuration.observe(labels, time)
  meterics.httpRequestTotal.inc(labels, 1)

  const reqLength = req.get('content-length')
  if (reqLength) {
    meterics.httpRequestSize.observe(labels, parseInt(reqLength))
  }

  const resLength = res.get('content-length')
  if (resLength) {
    meterics.httpResponseSize.observe(labels, parseInt(resLength))
  }
})

export const metricsHandler = async (req: Request, res: Response) => {
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
}
