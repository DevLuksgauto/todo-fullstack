import { Router } from "express";
import { profileController } from "./controllers/profile.controller";
import { verifyToken } from "@core/middlewares/auth.middleware";
import { authRateLimiter } from "@core/middlewares/rateLimit.middleware";

const profileRouter = Router();

profileRouter.use(verifyToken, authRateLimiter);

profileRouter.get('/me', profileController.getProfile);

profileRouter.patch('/update', profileController.updateProfile);

profileRouter.delete('/', profileController.deleteProfile);

export default profileRouter;