export default class ApiError extends Error {
  public statusCode: number
  public data: any

  constructor(message: string, statusCode: number) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
    this.data = {}
    this.statusCode = statusCode
  }
}
