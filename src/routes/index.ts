import { FastifyInstance } from 'fastify'
import authRoutes from './auth'
import taskRoutes from './task'
import labelRoutes from './label'

export default async function (fastify: FastifyInstance): Promise<void> {
    fastify.register(authRoutes, { prefix: '/api/auth' })
    fastify.register(taskRoutes, { prefix: '/api/tasks' })
    fastify.register(labelRoutes, { prefix: '/api/tasks' })
}