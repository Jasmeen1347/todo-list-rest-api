import mongoose, { Schema } from 'mongoose';
import { ITodo } from '../interfaces/models/ITodo';
import UserModel from './User';

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    dueDate: {
      type: Number,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UserModel.collection.name,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Number
    },
    updatedAt: {
      type: Number
    }
  },
  { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } }
);

export default mongoose.model<ITodo>('todo', todoSchema);
