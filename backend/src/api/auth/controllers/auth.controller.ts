import { Request, Response } from 'express';
import { signupSchema } from '../schemas/userSignup.schema';
import { loginSchema } from '../schemas/userLogin.schema';
import { authService } from '../services/auth.service';
import formatError from '@core/utils/formatError';

export const authController = {
    signup: async (req: Request, res: Response) => {
        try {
            const { name, email, password } = signupSchema.parse(req.body);
            const { user, token } = await authService.signup(name, email, password);
            return res.status(201).json({ user, token });
        } catch (error) {
            console.error('Signup error:', error);
            return res.status(400).json(formatError(error, 'Register error'));
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = await loginSchema.parse(req.body);
            const { user, token } = await authService.login(email, password);
            return res.status(200).json({ user, token });
        } catch (error) {
            console.error('Login error', error);
            return res.status(400).json(formatError(error, 'Login error'));
        }
    }
};