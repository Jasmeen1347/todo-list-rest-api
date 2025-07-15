import { Response } from 'express';
import Todo from '../models/Todo';
import { IAuthRequest } from '../interfaces/auth/IAuthRequest';
import { isValidObjectId } from 'mongoose';
import logger from '../utils/logger';
import status from 'http-status';

export const createTodo = async (req: IAuthRequest, res: Response) => {
  try {
    const { title, description, dueDate } = req.body;

    let dueDateInUnix = Math.floor(new Date(dueDate).getTime() / 1000);

    const todo = await Todo.create({
      title,
      description,
      dueDate: dueDateInUnix,
      user: req.userId
    });

    res.status(status.OK).json(todo);
  } catch (error) {
    logger.error(`Create todo: ${String(error)}`);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
};

export const getTodos = async (req: IAuthRequest, res: Response) => {
  try {
    const todos = await Todo.find({ user: req.userId, isDeleted: false });
    res.status(status.OK).json(todos);
  } catch (error) {
    logger.error(`get all todo: ${String(error)}`);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
};

export const getTodoById = async (req: IAuthRequest, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      logger.error(
        `Invalid Object ID ${req.params.id} while getting particular todo item`
      );
      return res
        .status(status.BAD_REQUEST)
        .json({ message: 'Invalid Object id' });
    }
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

export const updateTodo = async (req: IAuthRequest, res: Response) => {
  try {
    let dueDateInUnix = Math.floor(new Date(req.body.dueDate).getTime() / 1000);
    const data = { ...req.body, dueDate: dueDateInUnix };
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

export const deleteTodo = async (req: IAuthRequest, res: Response) => {
  try {
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
