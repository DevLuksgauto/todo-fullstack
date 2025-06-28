import { ZodError } from 'zod';

type ErrorResponse = {
    error: string;
    details?: ReturnType<ZodError['flatten']>;
}

const formatError = (error: unknown, customMessage: string): ErrorResponse => ({
    error: customMessage,
    ...(error instanceof ZodError && { details: error.flatten() })
});

export default formatError;