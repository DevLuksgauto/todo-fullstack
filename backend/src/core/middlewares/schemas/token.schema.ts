import { z } from 'zod';

export const tokenPayloadSchema = z.object({
    userId: z.string().uuid(),
    iat: z.number(),
    exp: z.number(),
})

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;