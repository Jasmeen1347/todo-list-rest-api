import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '../models/User';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
    ) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.'
      });
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

    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    // Compare password

    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', {
      expiresIn: '1d'
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
