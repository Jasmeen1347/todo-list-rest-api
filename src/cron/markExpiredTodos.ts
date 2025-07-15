import cron from 'node-cron';
import Todo from '../models/Todo';

export const startExpiredTodosCron = async () => {
  // Runs every day at midnight
  cron.schedule('0 0 * * *', async () => { // replace all 0 with * to run every minute
    console.log('Running CRON job to mark expired todos...');

    try {
      const now = Math.floor(new Date().getTime() / 1000);
      console.log(now);
      
      const result = await Todo.updateMany(
        {
          dueDate: { $lt: now },
          completed: false,
          isDeleted: false
        },
        { $set: { completed: true } }
      );

      console.log(
        `CRON JOB: Marked ${result.modifiedCount} expired todos as completed.`
      );
    } catch (error) {
      console.error('Error in CRON job:', error);
    }
  });
};
