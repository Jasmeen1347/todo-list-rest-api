import mongoose, { Document } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description: string;
  dueDate: Number;
  completed: boolean;
  user: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Number;
  updatedAt: Number;
}
