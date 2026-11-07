import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Generic validation middleware for request bodies, query params, or params.
 * Usage example:
 *   router.post('/api/foo', validate({ body: fooSchema }), handler);
 */
export function validate(schemas: {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      next();
    } catch (e) {
      // Zod throws a ValidationError with .errors array
      const err: any = new Error('Invalid request payload');
      err.status = 400;
      err.details = (e as any).errors;
      next(err);
    }
  };
}
