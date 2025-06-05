import { Request, Response } from "express"

interface ErrorResponse {
  success: boolean
  message: string
}

export default function server404ErrorHandler(req: Request, res: Response) {
  const error: ErrorResponse = {
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  }
  res.status(404).json(error)
}
