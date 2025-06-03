export default class ApiError extends Error {
  public statusCode: number
  public data: any
  public code: string

  constructor(statusCode: number, code: string, message: string) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
    this.data = {}
    this.statusCode = statusCode
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}
