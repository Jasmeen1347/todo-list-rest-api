import { body } from 'express-validator';

/**
 * Validation rules for user signup.
 *
 * - Validates that email is a proper email format.
 * - Enforces strong password requirements:
 *   - Minimum 8 characters
 *   - At least one uppercase letter
 *   - At least one lowercase letter
 *   - At least one number
 *   - At least one symbol
 */
export const signupValidator = [
  body('email').isEmail().withMessage('Email is invalid'),

  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol'
    )
];

/**
 * Validation rules for user login.
 *
 * - Validates that email is in proper format.
 * - Ensures password field is not empty.
 */
export const loginValidator = [
  body('email').isEmail().withMessage('Email is invalid'),

  body('password').notEmpty().withMessage('Password is required')
];
