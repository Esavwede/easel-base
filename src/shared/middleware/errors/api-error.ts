export default class ApiError extends Error {
  public statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
    this.statusCode = statusCode
  }
}
