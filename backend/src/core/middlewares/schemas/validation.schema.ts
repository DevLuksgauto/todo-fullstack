import { z } from "zod";

export const requestSchema = z.object({
    body: z.object({}).passthrough().optional(),
    params: z.object({}).passthrough().optional(),
    query: z.object({}).passthrough().optional()
});

export type RequestSchema = typeof requestSchema;
export type ValidationSchema<T extends RequestSchema> = T