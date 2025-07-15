import { Document } from 'mongoose';

// 1. Create a TypeScript interface describing a User document
export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Number;
  updatedAt: Number;
}
