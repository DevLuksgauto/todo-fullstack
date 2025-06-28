import { z } from 'zod';
import { tokenPayloadSchema } from 'schemas/token.schema';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
        user?: z.infer<typeof tokenPayloadSchema> | JwtPayload;
        }
    }
}