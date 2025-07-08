import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from './config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const appsErrors = {
    notFound: (message: string) => ({
        message,
        statusCode: 404,
        isOperational: true
    }),
    unauthorized: (message: string) => ({
        message,
        statusCode: 401,
        isOperational: true
    })
};

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const errorResponse = {
        success: false,
        error: err instanceof Error ? err.message : 'Something went wrong',
        ...(config.node_env === 'development' && {
            stack: err instanceof Error ? err.stack : undefined,
            details: err instanceof ZodError ? err.flatten() : null
        })
    };

    let statusCode = 500;

    if (err && typeof err === 'object' && 'statusCode' in err) {
        statusCode = Number(statusCode);
    } else if (err instanceof ZodError) {
        statusCode = 400;
    } else if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        statusCode = 409
    }

    if (config.node_env !== 'production') {
        console.error('Erro:', {
            path: req.path,
            method: req.method,
            error: errorResponse.error
        });
    }

    res.status(statusCode).json(errorResponse);
}