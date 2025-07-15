import cron from 'node-cron';
import Todo from '../models/Todo';
import logger from '../utils/logger';

export const startExpiredTodosCron = async () => {
  // Runs every day at midnight
  // replace all 0 with * to run every minute
  cron.schedule('0 0 * * *', async () => {
    logger.info(`Running CRON job to mark expired todos...`);

    try {
      const now = Math.floor(new Date().getTime() / 1000);
      const result = await Todo.updateMany(
        {
          dueDate: { $lt: now },
          completed: false,
          isDeleted: false
        },
        { $set: { completed: true } }
      );

      logger.info(
        `CRON JOB: Marked ${result.modifiedCount} expired todos as completed.`
      );
    } catch (error) {
      logger.error('Error in CRON job:', error);
    }
  });
};
