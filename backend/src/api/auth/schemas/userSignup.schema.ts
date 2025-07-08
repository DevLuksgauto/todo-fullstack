import { z } from 'zod';

export const signupSchema = z.object({
    name: z.string().min(3, { message: 'Name need to have at least 3 characters' }),
    email: z.string().email({ message: 'Email not valid' }),
    password: z.string().min(6, { message: 'Password need to have at least 6 characters' })
});

export type SignuoDTO = z.infer<typeof signupSchema>;