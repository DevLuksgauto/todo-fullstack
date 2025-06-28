import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { tokenPayloadSchema } from 'schemas/token.schema';
import { ZodError } from 'zod';

const secret = config.secret_key;

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ success: false, error: 'Token not provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.secret_key);

        const result = tokenPayloadSchema.safeParse(decoded);
        if (!result.success) {
            res.status(403).json({ error: "Invalid Token's instruction" });
            return;
        }
        req.user = result.data;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: true,
                error: 'Token expired'
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({
                success: false,
                error: 'Invalid token',
            });
            return;
        }

        if (error instanceof ZodError) {
            res.status(403).json({
                success: false,
                error: 'Invalid token payload',
                details: error.flatten()
            })
            return;
        }

        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal authentication error'
        });
    }
};