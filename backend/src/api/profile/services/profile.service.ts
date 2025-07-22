import { prisma } from "../../../lib/prisma";
import { userResponseSchema } from "../../../schemas/userResponse.schema";
import { UserUpdateDTO, userUpdateSchema } from "../schema/userUpdate.schema";

export const profileService = {
    getProfile: async ( userId: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });
        if (!user) throw new Error('User not found');

        return userResponseSchema.parse(user);
    },

    updateProfie: async (userId: string, updateData: UserUpdateDTO) => {
        const updateUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        return userResponseSchema.parse(updateUser)
    },

    deleteProfile: async (userId: string) => {
        try {
            await prisma.user.delete({
                where: { id: userId }
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }
}