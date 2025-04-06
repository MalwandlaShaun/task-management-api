import { FastifyInstance } from 'fastify'
import * as authController from '../controllers/auth'
import { registerSchema, loginSchema } from '../validators/auth'

export default async function (fastify: FastifyInstance): Promise<void> {
    fastify.post('/register', { schema: registerSchema }, authController.register)
    fastify.post('/login', { schema: loginSchema }, authController.login)
}