import { Router } from 'express';
import { UserController } from '../controllers';
import AuthMiddleware from '../middlewares/auth.middleware';

const router: Router = Router();
const userController = new UserController();

// GET - /users/profile
router.get('/profile', AuthMiddleware.verifyUser, userController.getProfile);

// POST - /users/fcm-token
router.post('/fcm-token', AuthMiddleware.verifyUser, userController.updateFcmToken);

// GET - /users/notifications
router.get('/notifications', AuthMiddleware.verifyUser, userController.getNotifications);

export default router;
