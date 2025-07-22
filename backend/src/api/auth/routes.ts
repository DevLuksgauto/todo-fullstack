import { Router } from 'express';
import { authController } from './controllers/auth.controller';
import { verifyToken } from '@core/middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);

// router.get('/profile', verifyToken, authController.getProfile)

export default authRouter;