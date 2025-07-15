import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import router from './routes';
import { setupSwagger } from './utils/swagger';
import { startExpiredTodosCron } from './cron/markExpiredTodos';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Register API routes
app.use('/api/', router);

// Initialize Swagger UI for API documentation
setupSwagger(app);

// Configure Winston logger as a stream for Morgan
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};
// Log HTTP requests using Morgan
app.use(morgan('combined', { stream }));

// Global error handler middleware
app.use(errorHandler);

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
