import express from 'express';
import authRoute from './authRoutes';
import todoRoute from './todoRoutes';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/todos',
    route: todoRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
