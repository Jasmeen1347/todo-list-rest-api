import { Request, Response } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: unknown, _req: Request, res: Response) => {
  if (err instanceof Error) {
    logger.error(err.stack || err.message);
  } else {
    logger.error(String(err));
  }

  res.status(500).json({ message: 'Internal server error' });
};
