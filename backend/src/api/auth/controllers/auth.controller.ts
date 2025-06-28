import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma';
import { config } from '../../../core/config';
import { signupSchema } from '../../../schemas/userSignup.schema';
import { loginSchema } from 'schemas/userLogin.schema';
import { userResponseSchema } from 'schemas/userResponse.schema';
import formatError from 'core/utils/formatError';

export const authController = {
    signupSchema: async (req: Request, res: Response) => {
        try {
            const { name, email, password } = signupSchema.parse(req.body);

            const existingUser = await prisma.user.findUnique({ where: { email } });

            if (existingUser) {
                res.status(400).json({ error: 'Email already registered' });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: { name, email, password: hashedPassword },
                select: { id: true, name: true, email: true, createdAt: true }
            });

            const token = jwt.sign({ userId: user.id }, config.secret_key, { expiresIn: '1h' });

            res.status(201).json({
                user: userResponseSchema.parse(user),
                token
            });
            return;
        } catch (error) {
            console.error('Signup error:', error);
            res.status(400).json(formatError(error, 'Register error'));
            return;
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = loginSchema.parse(req.body);

            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    createdAt: true
                }
            });
            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const token = jwt.sign({ userId: user.id }, config.secret_key, { expiresIn: '1h' });
            res.json({
                user: userResponseSchema.parse({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                }),
                token
            });
        } catch (error) {
            console.error('Login error', error);
            res.status(400).json(formatError(error, 'Login error'));
            return;
        }
    }
};