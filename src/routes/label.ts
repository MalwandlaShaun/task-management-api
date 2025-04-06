import { FastifyInstance } from 'fastify'
import * as labelController from '../controllers/label'
import { authenticate, validateUserExists } from '../middlewares/auth'
import { addLabelsSchema, removeLabelSchema } from '../validators/label'

export default async function (fastify: FastifyInstance): Promise<void> {
    // Apply authentication middleware to all routes
    fastify.addHook('onRequest', authenticate)
    fastify.addHook('onRequest', validateUserExists)

    // Label routes
    fastify.post('/:id/labels', { schema: addLabelsSchema }, labelController.addLabels)
    fastify.delete('/:id/labels/:labelId', { schema: removeLabelSchema }, labelController.removeLabel)
}