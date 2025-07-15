import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/models/IUser';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    },
    updatedAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('user', userSchema);
