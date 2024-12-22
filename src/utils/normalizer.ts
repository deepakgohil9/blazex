import { URL } from 'url'
import UrlValueParser from 'url-value-parser'

const parser = new UrlValueParser()

/**
 * Normalize the path by replacing the values with the placeholder
 *
 * @param originalUrl - the original URL
 * @param placeholder - default is '#val'
 * @returns the normalized path
 */
const normalizePath = (originalUrl: string, placeholder = '#val') => {
  const { pathname } = new URL(originalUrl, 'http://localhost')
  return parser.replacePathValues(pathname, placeholder)
}


/**
 * Normalize the status code to a range
 *
 * @param statusCode - the status code
 * @returns the normalized status code
 */
const normalizeStatusCode = (statusCode: number) => {
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

export default {
  normalizePath,
  normalizeStatusCode
}
