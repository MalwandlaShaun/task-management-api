import { FastifyInstance } from 'fastify'
import * as taskController from '../controllers/task'
import { authenticate, validateUserExists } from '@/middlewares/auth'
import {
    createTaskSchema,
    updateTaskSchema,
    updateTaskStatusSchema,
    assignTaskSchema,
    getTasksQuerySchema
} from '@/validators/task'

export default async function (fastify: FastifyInstance): Promise<void> {
    // Apply authentication middleware to all routes
    // @ts-ignore
    fastify.addHook('onRequest', authenticate)
    // @ts-ignore
    fastify.addHook('onRequest', validateUserExists)

    // Task routes
    // @ts-ignore
    fastify.post('/', { schema: createTaskSchema }, taskController.createTask)
    // @ts-ignore
    fastify.get('/', { schema: getTasksQuerySchema }, taskController.getTasks)
    fastify.get('/:id', taskController.getTask)
    // @ts-ignore
    fastify.put('/:id', { schema: updateTaskSchema }, taskController.updateTask)
    fastify.delete('/:id', taskController.deleteTask)
    // @ts-ignore
    fastify.put('/:id/assign', { schema: assignTaskSchema }, taskController.assignTask)
    // @ts-ignore
    fastify.put('/:id/status', { schema: updateTaskStatusSchema }, taskController.updateTaskStatus)
}