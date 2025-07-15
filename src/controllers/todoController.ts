import { Response } from 'express';
import Todo from '../models/Todo';
import { IAuthRequest } from '../interfaces/auth/IAuthRequest';
import { isValidObjectId } from 'mongoose';

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

    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getTodos = async (req: IAuthRequest, res: Response) => {
  try {
    const todos = await Todo.find({ user: req.userId, isDeleted: false });
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getTodoById = async (req: IAuthRequest, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Object id' });
    }
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.userId,
      isDeleted: false
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
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
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
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
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
