import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes';
import { setupSwagger } from './utils/swagger';
import { startExpiredTodosCron } from './cron/markExpiredTodos';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/', router);

setupSwagger(app);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startExpiredTodosCron()
    });
  })
  .catch((err) => {
    console.error(err);
  });
