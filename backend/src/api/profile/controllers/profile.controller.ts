import { Request, Response } from 'express';
import { userUpdateSchema } from '@api/profile/schema/userUpdate.schema';
import { profileService } from '../services/profile.service';
import formatError from '@core/utils/formatError';

export const profileController = {
    getProfile: async (req: Request, res: Response) => {
        try {
            const user = await profileService.getProfile(req.user?.userId);
            return res.json(user);
        } catch (error) {
            console.error('Error fetching profile:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateProfile: async (req: Request, res: Response) => {
        try {
            const updateData = userUpdateSchema.parse(req.body);
            const userUpdate = await profileService.updateProfie(req.user?.userId, updateData);
            return res.json(userUpdate);
        } catch (error) {
            console.error('Error updating profile', error);
            return res.status(400).json(formatError(error, 'Validation failed'));
        }
    },

    deleteProfile: async (req: Request, res: Response) => {
        try {
            await profileService.deleteProfile(req.user!.userId);
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting profile:', error);
            return res.status(500).json({
                error: 'Failed to delete profile'
            });
        }
    }
};
