import { body, param } from 'express-validator';

/**
 * Validation rules for creating a new Todo.
 *
 * - Requires a title (non-empty string).
 * - Requires a description (non-empty string).
 * - Requires a valid dueDate in ISO8601 format.
 */
export const createTodoValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid ISO date')
];

/**
 * Validation rules for updating a Todo.
 *
 * - Allows optional fields.
 * - Validates that title/description are strings and not empty if provided.
 * - Validates dueDate if provided.
 * - Validates completed flag as boolean if provided.
 */
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

/**
 * Validator for validating MongoDB ObjectId in route parameters.
 *
 * - Ensures the 'id' parameter is a valid Mongo ObjectId.
 */
export const idParamValidator = [
  param('id').isMongoId().withMessage('Invalid ID format')
];
