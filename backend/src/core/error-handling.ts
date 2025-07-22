import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '@core/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from './types';

export const appsErrors = {
    notFound: (message: string):AppError => ({
        message,
        statusCode: 404,
        isOperational: true
    }),
    unauthorized: (message: string): AppError => ({
        message,
        statusCode: 401,
        isOperational: true
    }),
    badRequest: (message: string): AppError => ({
        message,
        statusCode: 400,
        isOperational: true
    }),
    conflict: (message: string): AppError => ({
        message,
        statusCode: 409,
        isOperational: true
    })
};

const isAppError = (err: unknown): err is AppError => {
    return (
        typeof err === 'object' &&
        err !== null &&
        'statusCode' in err &&
        'isOperational' in err
    );
}


export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const errorResponse = {
        success: false,
        error: err instanceof Error ? err.message : 'Internal server error',
        ...(config.node_env === 'development' && {
            stack: err instanceof Error ? err.stack : undefined,
            details: err instanceof ZodError ? err.flatten() : null
        })
    };

    let statusCode = 500;

    if (isAppError(err)) {
        statusCode = err.statusCode;
    } else if (err instanceof ZodError) {
        statusCode = 400;
    } else if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        statusCode = 409;
        errorResponse.error = 'Duplicate entry detected';
    }

    if (config.node_env !== 'production') {
        console.error('[Error Handler]:', {
            path: req.path,
            method: req.method,
            statusCode,
            error: errorResponse.error
        });
    }

    return res.status(statusCode).json(errorResponse);
}