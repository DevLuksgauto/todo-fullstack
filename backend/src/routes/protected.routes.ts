import { Router } from 'express';
import { verifyToken } from '../core/middlewares/auth.middleware';
import { getUserProfile } from 'api/profile/controllers/profile.controller';

const router = Router();

router.use(verifyToken);

router.get('/profile', getUserProfile)

export default router;