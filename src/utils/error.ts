class AppError extends Error {
  type: string  	// A URI reference that identifies the problem type. The type field is used to identify the error type and provide a link to the documentation that describes the error in more detail
  title: string	// A short, human-readable summary of the problem type. It SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
  status: number	// The HTTP status code applicable to this problem.
  code: string	// An application-specific error code, expressed as a string value.
  detail: string	// A human-readable explanation specific to this occurrence of the problem.

  constructor(data: { type: string, title: string, status: number, code: string, detail: string }) {
    super(data.title)
    this.type = data.type
    this.title = data.title
    this.status = data.status
    this.code = data.code
    this.detail = data.detail
  }
}

class NotFound extends AppError {
  constructor(data: { type?: string, title: string, code?: string, detail: string }) {
    super({
      type: data.type ?? 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404',
      title: data.title,
      status: 404,
      code: data.code ?? 'not_found',
      detail: data.detail,
    })
  }
}

class ValidationError extends AppError {
  constructor(data: { type?: string, title: string, code?: string, detail: string }) {
    super({
      type: data.type ?? 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400',
      title: data.title,
      status: 400,
      code: data.code ?? 'validation_error',
      detail: data.detail,
    })
  }
}

class BadRequest extends AppError {
  constructor(data: { type?: string, title: string, code?: string, detail: string }) {
    super({
      type: data.type ?? 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400',
      title: data.title,
      status: 400,
      code: data.code ?? 'bad_request',
      detail: data.detail,
    })
  }
}

class Unauthorized extends AppError {
  constructor(data: { type?: string, title: string, code?: string, detail: string }) {
    super({
      type: data.type ?? 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401',
      title: data.title,
      status: 401,
      code: data.code ?? 'unauthorized',
      detail: data.detail,
    })
  }
}

class PaymentRequired extends AppError {
  constructor(data: { type?: string, title: string, code?: string, detail: string }) {
    super({
      type: data.type ?? 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402',
      title: data.title,
      status: 402,
      code: data.code ?? 'payment_required',
      detail: data.detail,
    })
  }
}

class Forbidden extends AppError {
  constructor(data: { type?: string, title: string, code?: string, detail: string }) {
    super({
      type: data.type ?? 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403',
      title: data.title,
      status: 403,
      code: data.code ?? 'forbidden',
      detail: data.detail,
    })
  }
}

class Conflict extends AppError {
  constructor(data: { type?: string, title: string, code?: string, detail: string }) {
    super({
      type: data.type ?? 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409',
      title: data.title,
      status: 409,
      code: data.code ?? 'conflict',
      detail: data.detail,
    })
  }
}

class InternalServerError extends AppError {
  constructor(data: { type?: string, title: string, code?: string, detail: string }) {
    super({
      type: data.type ?? 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500',
      title: data.title,
      status: 500,
      code: data.code ?? 'internal_server_error',
      detail: data.detail,
    })
  }
}

class NotImplemented extends AppError {
  constructor(data: { type?: string, title: string, code?: string, detail: string }) {
    super({
      type: data.type ?? 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501',
      title: data.title,
      status: 501,
      code: data.code ?? 'not_implemented',
      detail: data.detail,
    })
  }
}

class ServiceUnavailable extends AppError {
  constructor(data: { type?: string, title: string, code?: string, detail: string }) {
    super({
      type: data.type ?? 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503',
      title: data.title,
      status: 503,
      code: data.code ?? 'service_unavailable',
      detail: data.detail,
    })
  }
}

export default {
  AppError,
  NotFound,
  ValidationError,
  BadRequest,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  Conflict,
  InternalServerError,
  NotImplemented,
  ServiceUnavailable,
}
