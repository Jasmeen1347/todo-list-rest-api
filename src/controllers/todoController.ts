import { Response } from 'express';
import Todo from '../models/Todo';
import { IAuthRequest } from '../interfaces/auth/IAuthRequest';
import logger from '../utils/logger';
import status from 'http-status';

/**
 * Create a new todo for the authenticated user
 */
export const createTodo = async (req: IAuthRequest, res: Response) => {
  try {
    const { title, description, dueDate } = req.body;

    // Convert dueDate to a Unix timestamp (seconds)
    let dueDateInUnix = Math.floor(new Date(dueDate).getTime() / 1000);

    // Create new Todo document
    const todo = await Todo.create({
      title,
      description,
      dueDate: dueDateInUnix,
      user: req.userId
    });

    res.status(status.CREATED).json(todo);
  } catch (error) {
    // Log unexpected errors
    logger.error(`Create todo: ${String(error)}`);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
};

/**
 * Get all todos for the authenticated user
 */
export const getTodos = async (req: IAuthRequest, res: Response) => {
  try {
    // Fetch all non-deleted todos for this user
    const todos = await Todo.find({ user: req.userId, isDeleted: false });
    res.status(status.OK).json(todos);
  } catch (error) {
    logger.error(`get all todo: ${String(error)}`);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
};

/**
 * Get a single todo by its ID
 */
export const getTodoById = async (req: IAuthRequest, res: Response) => {
  try {
    // Find the todo for this user
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.userId,
      isDeleted: false
    });

    if (!todo) {
      logger.error(
        `Todo not found for ID ${req.params.id} and user ${req.userId} while getting particular todo item`
      );
      return res.status(status.NOT_FOUND).json({ message: 'Todo not found' });
    }

    res.status(status.OK).json(todo);
  } catch (error) {
    logger.error(`get todo by id: ${String(error)}`);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
};

/**
 * Update an existing todo
 */
export const updateTodo = async (req: IAuthRequest, res: Response) => {
  try {
    const data = { ...req.body };

    // Convert dueDate to a Unix timestamp (seconds) if it exist
    if (req.body.dueDate) {
      data.dueDate = Math.floor(new Date(req.body.dueDate).getTime() / 1000);
    }

    // Find and update the todo for this user
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId, isDeleted: false },
      data,
      { new: true }
    );

    if (!todo) {
      logger.error(
        `Todo not found for ID ${req.params.id} and user ${req.userId} while update todo item`
      );
      return res.status(status.NOT_FOUND).json({ message: 'Todo not found' });
    }

    res.status(status.OK).json(todo);
  } catch (error) {
    logger.error(`update todo: ${String(error)}`);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
};

/**
 * Soft-delete a todo by marking it as deleted
 */
export const deleteTodo = async (req: IAuthRequest, res: Response) => {
  try {
    // Soft-delete the todo for this user
    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId
      },
      { isDeleted: true }
    );

    if (!todo) {
      logger.error(
        `Todo not found for ID ${req.params.id} and user ${req.userId} while deleting particular todo item`
      );
      return res.status(status.NOT_FOUND).json({ message: 'Todo not found' });
    }

    res.status(status.OK).json({ message: 'Todo deleted' });
  } catch (error) {
    logger.error(`delete todo: ${String(error)}`);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
};
