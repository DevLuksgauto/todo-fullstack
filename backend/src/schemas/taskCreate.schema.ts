import { z } from 'zod';

export const taskCreateSchema = z.object({
    title: z.string().min(1),
    completed: z.boolean().optional().default(false),
    userId: z.string().uuid()
});

export type TaskCreateDTO = z.infer<typeof taskCreateSchema>;