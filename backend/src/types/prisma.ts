import { Prisma } from '@prisma/client';

export type User = Prisma.UserGetPayload<{}>;
export type Task = Prisma.TaskGetPayload<{}>;

export type UserWithTasks = Prisma.UserGetPayload<{
    include: { tasks: true}
}>;