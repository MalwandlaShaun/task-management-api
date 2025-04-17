import { FastifyInstance } from 'fastify'
import * as labelController from '../controllers/label'
import { authenticate, validateUserExists } from '../middlewares/auth'
import { addLabelsSchema, removeLabelSchema } from '../validators/label'

export default async function (fastify: FastifyInstance): Promise<void> {
    // Apply authentication middleware to all routes
    // @ts-ignore
    fastify.addHook('onRequest', authenticate)
    // @ts-ignore
    fastify.addHook('onRequest', validateUserExists)

    // Label routes
    // @ts-ignore
    fastify.post('/:id/labels', { schema: addLabelsSchema }, labelController.addLabels)
    // @ts-ignore
    fastify.delete('/:id/labels/:labelId', { schema: removeLabelSchema }, labelController.removeLabel)
}