import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest } from '../interfaces/auth/IAuthRequest';
import status from 'http-status';

/**
 * Authentication middleware.
 *
 * - Checks for a Bearer token in the Authorization header.
 * - Verifies the JWT token.
 * - Adds userId from the token payload into the request object.
 * - Blocks the request if token is missing or invalid.
 */
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
  // Extract token from header
  const token = authHeader.split(' ')[1];

  try {
    // verify jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
      userId: string;
    };

    // Attach user ID to the request object for later use in controllers
    req.userId = decoded.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNAUTHORIZED)
      .json({ message: 'Not authorized, invalid token' });
  }
};
