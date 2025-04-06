import { FastifyRequest, FastifyReply } from 'fastify'
import * as labelService from '../services/label'
import * as taskService from '../services/task'

interface AuthenticatedRequest extends FastifyRequest {
    user: {
        id: string
        email: string
    }
}

interface AddLabelsRequest extends AuthenticatedRequest {
    params: {
        id: string
    }
    body: {
        labels: string[]
    }
}

interface RemoveLabelRequest extends AuthenticatedRequest {
    params: {
        id: string
        labelId: string
    }
}

export async function addLabels (request: AddLabelsRequest, reply: FastifyReply): Promise<void> {
    try {
        const { id } = request.params
        const { labels } = request.body

        const task = await taskService.getTaskById(id)

        if (!task) {
            reply.code(404).send({ error: 'Task not found' })
            return
        }

        // Check if user has access to add labels to the task
        if (task.creatorId !== request.user.id && task.assigneeId !== request.user.id) {
            reply.code(403).send({ error: 'You do not have permission to add labels to this task' })
            return
        }

        await labelService.addLabelsToTask(id, labels)

        const updatedTask = await taskService.getTaskById(id)

        reply.send(updatedTask)
    } catch (error) {
        request.log.error(error)
        reply.code(500).send({ error: 'Internal server error' })
    }
}

export async function removeLabel (request: RemoveLabelRequest, reply: FastifyReply): Promise<void> {
    try {
        const {id, labelId} = request.params

        const task = await taskService.getTaskById(id)

        if (!task) {
            reply.code(404).send({error: 'Task not found'})
            return
        }

        // Check if user has access to remove labels from the task
        if (task.creatorId !== request.user.id && task.assigneeId !== request.user.id) {
            reply.code(403).send({error: 'You do not have permission to remove labels from this task'})
            return
        }

        await labelService.removeLabelFromTask(id, labelId)

        reply.code(204).send()
    } catch (error) {
        request.log.error(error)

        // NOT YET FINISHED!!!!!!!!!!!!
    }
}