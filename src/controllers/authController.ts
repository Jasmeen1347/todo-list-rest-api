import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import status from 'http-status';
import User from '../models/User';
import logger from '../utils/logger';

/**
 * User signup controller
 *
 * Registers a new user by:
 * - Checking if the email already exists
 * - Hashing the password using SHA-256
 * - Storing the new user in the database
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.error(`signup: User already exists ${email}`);
      return res
        .status(status.BAD_REQUEST)
        .json({ message: 'User already exists' });
    }

    // Hash password using SHA-256
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword
    });

    res
      .status(status.CREATED)
      .json({ message: 'User created', userId: user._id });
  } catch (error) {
    logger.error(`signup: ${String(error)}`);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
};

/**
 * User login controller
 *
 * Authenticates a user by:
 * - Checking if the user exists
 * - Validating the password
 * - Generating a JWT token upon successful login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.error(`login: invalid credentials for user ${email}`);
      return res
        .status(status.BAD_REQUEST)
        .json({ message: 'Invalid credentials' });
    }

    // Hash the provided password for comparison
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    // Compare password
    if (hashedPassword !== user.password) {
      logger.error(`login: Password does not match for user ${email}`);
      return res
        .status(status.BAD_REQUEST)
        .json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token with 1-day expiry
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', {
      expiresIn: '1d'
    });

    res.status(status.OK).json({ token });
  } catch (error) {
    logger.error(`login: ${String(error)}`);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' });
  }
};
