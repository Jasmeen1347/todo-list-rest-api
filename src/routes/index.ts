import express from 'express';
import authRoute from './authRoutes';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
