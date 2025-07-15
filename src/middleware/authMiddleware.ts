import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest } from '../interfaces/auth/IAuthRequest';
import status from 'http-status';

export const isAuthenticate = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Check for Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(status.UNAUTHORIZED)
      .json({ message: 'Authentication required. Please log in to continue.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
      userId: string;
    };

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNAUTHORIZED)
      .json({ message: 'Not authorized, invalid token' });
  }
};
