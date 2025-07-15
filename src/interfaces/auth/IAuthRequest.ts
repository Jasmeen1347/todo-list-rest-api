import { Request } from 'express';

// Extend Express Request type to include `userId`
export interface IAuthRequest extends Request {
  userId?: string;
}
