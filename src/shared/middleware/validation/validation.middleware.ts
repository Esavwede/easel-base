import { ZodError, ZodSchema } from "zod"
import { Request, Response, NextFunction } from "express"

export default function validateRequestSchema(schemas: {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // set errors variable
    var validationErrors: any = []

    if (schemas.body) {
      try {
        req.body = await schemas.body.parseAsync(req.body)
      } catch (e: any) {
        if (e instanceof ZodError) {
          e.issues.forEach((issue) => {
            validationErrors.push(issue)
          })
        }
      }
    }

    if (schemas.params) {
      try {
        // validate
        req.params = await schemas.params.parseAsync(req.params)
      } catch (e: any) {
        if (e instanceof ZodError) {
          e.issues.forEach((issue) => {
            validationErrors.push(issue)
          })
        }
      }
    }

    if (schemas.query) {
      try {
        // validate
        req.query = await schemas.query.parseAsync(req.query)
      } catch (e: any) {
        if (e instanceof ZodError) {
          e.issues.forEach((issue) => {
            validationErrors.push(issue)
          })
        }
      }
    }

    if (validationErrors.length > 0) {
      // throw 400 error
      console.dir("Validation errors:", validationErrors)
      res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: validationErrors,
      })
      return
    }

    // call next middleware
    next()
  }
}
