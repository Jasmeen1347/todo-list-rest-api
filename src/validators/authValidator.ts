import { body } from 'express-validator';

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

export const loginValidator = [
  body('email').isEmail().withMessage('Email is invalid'),

  body('password').notEmpty().withMessage('Password is required')
];
