import { z } from 'zod';

export const userResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.date()
})

export type UserResponse = z.infer<typeof userResponseSchema>;