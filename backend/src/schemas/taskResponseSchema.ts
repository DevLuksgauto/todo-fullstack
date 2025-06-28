import { z } from 'zod';

export const taskResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    completed: z.boolean(),
    userId: z.string().uuid(),
    createdAt: z.date()
});

export type TaskResponse = z.infer<typeof taskResponseSchema>;