import mongoose from 'mongoose';
import Todo from '../../src/models/Todo';
import { markExpiredTodos } from '../../src/cron/markExpiredTodos';

describe('Cron Job', () => {
  it('should mark expired todos as completed', async () => {
    const todo = await Todo.create({
      title: 'Expired',
      description: 'Past todo',
      dueDate: Math.floor(Date.now() / 1000) - 60, // 1 minute ago
      user: new mongoose.Types.ObjectId(),
      completed: false
    });

    await markExpiredTodos();
    const updatedTodo = await Todo.findById(todo._id);
    expect(updatedTodo?.completed).toBe(true);
  });
});
