import Fastify, { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import routes from '../src/routes'

export async function build (): Promise<FastifyInstance> {
    const app = Fastify({
        logger: false
    })

    app.register(fastifyJwt, {
        secret: 'test_secret'
    })

    app.register(routes)

    await app.ready()
    return app
}