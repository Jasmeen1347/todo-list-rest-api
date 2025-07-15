import { body, param } from 'express-validator';

export const createTodoValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid ISO date')
];

export const updateTodoValidator = [
  body('title')
    .optional()
    .custom((value) => {
      if (typeof value !== 'string') {
        throw new Error('Title must be a string');
      }
      if (value.trim() === '') {
        throw new Error('Title cannot be empty');
      }
      return true;
    }),

  body('description')
    .optional()
    .custom((value) => {
      if (typeof value !== 'string') {
        throw new Error('Description must be a string');
      }
      if (value.trim() === '') {
        throw new Error('Description cannot be empty');
      }
      return true;
    }),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO date'),

  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean')
];

export const idParamValidator = [
  param('id').isMongoId().withMessage('Invalid ID format')
];
