import { FastifyRequest, FastifyReply } from 'fastify'
import { User } from '../models/User'


// @ts-ignore
interface AuthRequest extends FastifyRequest {
    user?: {
        id: string
        email: string
    }
}

export async function authenticate (request: AuthRequest, reply: FastifyReply): Promise<void> {
    try {
        await request.jwtVerify()
    } catch (err) {
        reply.status(401).send({ error: 'Unauthorized' })
    }
}

export async function validateUserExists (request: AuthRequest, reply: FastifyReply): Promise<void> {
    if (!request.user) {
        reply.status(401).send({ error: 'Unauthorized' })
        return
    }

    const user = await User.findByPk(request.user.id)
    if (!user) {
        reply.status(401).send({ error: 'User not found' })
    }
}