import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import status from 'http-status';
import User from '../models/User';
import logger from '../utils/logger';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.error(`User already exists ${email}`);
      return res
        .status(status.BAD_REQUEST)
        .json({ message: 'User already exists' });
    }

    // Hash password
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      logger.error(`invalid credentials for user ${email}`);
      return res
        .status(status.BAD_REQUEST)
        .json({ message: 'Invalid credentials' });
    }

    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    // Compare password

    if (hashedPassword !== user.password) {
      logger.error(`Password does not match for user ${email}`);
      return res
        .status(status.BAD_REQUEST)
        .json({ message: 'Invalid credentials' });
    }

    // Create JWT
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
