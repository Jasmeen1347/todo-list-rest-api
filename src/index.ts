import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { startExpiredTodosCron } from './cron/markExpiredTodos';
import app from './app';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    logger.info('MongoDB connected');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`Server running on port ${PORT}`);
      startExpiredTodosCron();
    });
  })
  .catch((err) => {
    logger.error(`MongoDB connection error: ${String(err)}`);
    process.exit(1);
  });
