import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma';
import { config } from '@core/config';
import { userResponseSchema } from '../../../schemas/userResponse.schema';

export const authService = {
    signup: async (name: string, email: string, password: string) => {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new Error('Email already registered');

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashPassword },
            select: { id: true, name: true, email: true, createdAt: true },
        });

        const token = jwt.sign({ userId: user.id }, config.secret_key, { expiresIn: '1h' });
        return { user: userResponseSchema.parse(user), token };
    },

    login: async (email: string, password: string) => {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, password: true, createdAt: true }
        });
        if (!user) throw new Error('Invalid credentials');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error('Invalid credentials');

        const token = jwt.sign({ user: user.id }, config.secret_key, { expiresIn: '1h' });

        return {
            user: userResponseSchema.parse({
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            }),
            token,
        };
    },
};