import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { userResponseSchema } from 'schemas/userResponse.schema';
import { userUpdateSchema } from 'schemas/userUpdate.schema';
import formatError from 'core/utils/formatError';

export const profileController = {
    getProfile: async (req: Request, res: Response) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user!.userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true
                }
            });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const response = userResponseSchema.parse(user);
            res.json(response);
            return;
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    },

    updateProfile: async (req: Request, res: Response) => {
        try {
            const updateData = userUpdateSchema.parse(req.body);

            const updateUser = await prisma.user.update({
                where: { id: req.user!.userId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true
                }
            });
            res.json(userResponseSchema.parse(updateUser));
            return;
        } catch (error) {
            console.error('Error updating profile', error);
            res.status(400).json(formatError(error, 'Validation failed'));
            return;
        }
    }
};
