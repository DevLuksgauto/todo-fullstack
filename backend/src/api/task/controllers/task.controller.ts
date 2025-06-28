import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { taskCreateSchema } from 'schemas/taskCreate.schema';
import { taskResponseSchema } from 'schemas/taskResponseSchema';
import formatError from 'core/utils/formatError';

export const taskController = {
    createTask: async (req: Request, res: Response) => {
        try {
            const taskData = taskCreateSchema.parse({
                title: req.body.title,
                completed: req.body.completed,
                userId: req.user!.userId,
            });

            const task = await prisma.task.create({
                data: taskData,
                select: {
                    id: true,
                    title: true,
                    completed: true,
                    userId: true,
                    createdAt: true
                }
            });
            res.status(201).json(taskCreateSchema.parse(task));
            return;
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(400).json(formatError(error, 'Invalid task data'));
            return;
        }
    },

    getTasks: async (req: Request, res: Response) => {
        try {
            const tasks = await prisma.task.findMany({
                where: { userId: req.user!.userId },
                select: {
                    id: true,
                    title: true,
                    completed: true,
                    userId: true,
                    createdAt: true
                }
            });
            res.status(200).json(taskResponseSchema.array().parse(tasks));
            return;
        } catch (error) {
            console.error('Error fetching tasks', error);
            res.status(500).json(formatError(error, 'Internal server error'));
            return;
        }
    }
};