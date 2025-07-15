import express from 'express';
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
} from '../controllers/todoController';
import { isAuthenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import {
  createTodoValidator,
  idParamValidator,
  updateTodoValidator
} from '../validators/todoValidator';

const router = express.Router();

router.post('/', isAuthenticate, validate(createTodoValidator), createTodo);
router.get('/', isAuthenticate, getTodos);
router.put(
  '/:id',
  isAuthenticate,
  validate([...idParamValidator, ...updateTodoValidator]),
  updateTodo
);
router.get('/:id', isAuthenticate, validate(idParamValidator), getTodoById);
router.delete('/:id', isAuthenticate, validate(idParamValidator), deleteTodo);

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Created
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the logged-in user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo found
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo updated
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo deleted
 */

export default router;
