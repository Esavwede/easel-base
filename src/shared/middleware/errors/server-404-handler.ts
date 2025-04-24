import { Request, Response } from "express";

interface ErrorResponse {
  status: string;
  code: number;
  message: string;
  details?: string;
}

export default function server404ErrorHandler(req: Request, res: Response) {
  const error: ErrorResponse = {
    status: "error",
    code: 404,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
    details:
      "The requested endpoint does not exist or the resource is unavailable.",
  };

  console.log("404 Error");
  console.dir(error);
  res.status(404).json(error);
}
