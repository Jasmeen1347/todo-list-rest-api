import express from 'express';
import morgan from 'morgan';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import router from './routes';
import { setupSwagger } from './utils/swagger';

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

export default app;
