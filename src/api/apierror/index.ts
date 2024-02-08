export class APIError extends Error {
  statusCode: number

  constructor (message: string, public code: number) {
    super(message)
    this.statusCode = code
  }

  static unauthorized (message: string = 'Unauthorized'): APIError {
    return new APIError(message, 401)
  }

  static forbidden (message: string = 'Forbidden'): APIError {
    return new APIError(message, 403)
  }

  static notFound (message: string = 'Not Found'): APIError {
    return new APIError(message, 404)
  }

  static badRequest (message: string = 'Bad Request'): APIError {
    return new APIError(message, 400)
  }

  static internalServerError (message: string = 'Internal Server Error'): APIError {
    return new APIError(message, 500)
  }

  static fromError (error: Error): APIError {
    return new APIError(error.message, 500)
  }
}
