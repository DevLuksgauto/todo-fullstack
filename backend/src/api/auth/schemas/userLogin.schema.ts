import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password needed')
});

export type LoginDTO = z.infer<typeof loginSchema>;