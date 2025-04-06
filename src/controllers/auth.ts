import { FastifyRequest, FastifyReply } from 'fastify'
import * as authService from '../services/auth'

interface RegisterRequest extends FastifyRequest {
    body: {
        email: string
        password: string
    }
}

interface LoginRequest extends FastifyRequest {
    body: {
        email: string
        password: string
    }
}

export async function register (request: RegisterRequest, reply: FastifyReply): Promise<void> {
    try {
        const { email, password } = request.body

        const user = await authService.register({ email, password })

        reply.code(201).send({
            id: user.id,
            email: user.email
        })
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            reply.code(409).send({ error: 'Email already exists' })
            return
        }

        request.log.error(error)
        reply.code(500).send({ error: 'Internal server error' })
    }
}

export async function login (request: LoginRequest, reply: FastifyReply): Promise<void> {
    try {
        const { email, password } = request.body

        const user = await authService.login({ email, password })

        if (!user) {
            reply.code(401).send({ error: 'Invalid email or password' })
            return
        }

        const token = await reply.jwtSign(
            { id: user.id, email: user.email },
            { expiresIn: process.env.JWT_EXPIRATION || '24h' }
        )

        reply.send({ token })
    } catch (error) {
        request.log.error(error)
        reply.code(500).send({ error: 'Internal server error' })
    }
}