import { URL } from 'url'
import UrlValueParser from 'url-value-parser'

const parser = new UrlValueParser()

export const normalizePath = (originalUrl: string, placeholder: string = '#val') => {
  const { pathname } = new URL(originalUrl, 'http://localhost')
  return parser.replacePathValues(pathname, placeholder)
}

export const normalizeStatusCode = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) {
    return '2xx'
  }

  if (statusCode >= 300 && statusCode < 400) {
    return '3xx'
  }

  if (statusCode >= 400 && statusCode < 500) {
    return '4xx'
  }

  return '5xx'
}
