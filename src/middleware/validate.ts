import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import status from 'http-status';

/**
 * Middleware to execute express-validator validation chains and handle errors.
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute each validation chain in order
    for (let validation of validations) {
      await validation.run(req);
    }
    // Gather validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Format errors and return response
      return res.status(status.BAD_REQUEST).json({
        errors: errors.array().map((err) => ({
          message: err.msg
        }))
      });
    }
    // If no validation errors, continue to the next middleware
    next();
  };
};
