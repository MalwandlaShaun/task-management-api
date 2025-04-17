import { FastifyInstance } from 'fastify'
import * as authController from '../controllers/auth'
import { registerSchema, loginSchema } from '../validators/auth'

export default async function (fastify: FastifyInstance): Promise<void> {
    // @ts-ignore
    fastify.post('/register', { schema: registerSchema }, authController.register)

    // @ts-ignore
    fastify.post('/login', { schema: loginSchema }, authController.login)
}