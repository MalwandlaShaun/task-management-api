import { FastifyInstance } from 'fastify'
import * as taskController from '../controllers/task'
import { authenticate, validateUserExists } from '../middlewares/auth'
import {
    createTaskSchema,
    updateTaskSchema,
    updateTaskStatusSchema,
    assignTaskSchema,
    getTasksQuerySchema
} from '../validators/task'

export default async function (fastify: FastifyInstance): Promise<void> {
    // Apply authentication middleware to all routes
    fastify.addHook('onRequest', authenticate)
    fastify.addHook('onRequest', validateUserExists)

    // Task routes
    fastify.post('/', { schema: createTaskSchema }, taskController.createTask)
    fastify.get('/', { schema: getTasksQuerySchema }, taskController.getTasks)
    fastify.get('/:id', taskController.getTask)
    fastify.put('/:id', { schema: updateTaskSchema }, taskController.updateTask)
    fastify.delete('/:id', taskController.deleteTask)
    fastify.put('/:id/assign', { schema: assignTaskSchema }, taskController.assignTask)
    fastify.put('/:id/status', { schema: updateTaskStatusSchema }, taskController.updateTaskStatus)
}