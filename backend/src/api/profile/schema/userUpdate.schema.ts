import { z } from 'zod';

export const userUpdateSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be filled out to update'
});

export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;