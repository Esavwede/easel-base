import { ZodSchema } from "zod"
import { Request, Response, NextFunction } from "express"

export default async function validateRequestSchema(schemas: {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}) {
  return function (req: Request, res: Response, next: NextFunction) {
    // set errors variable
    var validationErrors = []

    if (schemas.body) {
      // validate
      try {
      } catch (e: any) {
        // add to errors
      }
    }

    if (schemas.params) {
      try {
        // validate
      } catch (e: any) {
        // add to errors
      }
    }

    if (schemas.query) {
      try {
        // validate
      } catch (e: any) {
        // add to errors
      }
    }

    if (validationErrors.length > 0) {
      // throw 400 error
    }

    // call next middleware
  }
}
