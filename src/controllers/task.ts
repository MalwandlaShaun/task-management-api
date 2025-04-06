import { FastifyRequest, FastifyReply } from 'fastify'
import * as taskService from '../services/task'
import { TaskPriority, TaskStatus } from '../models/Task'

interface AuthenticatedRequest extends FastifyRequest {
    user: {
        id: string
        email: string
    }
}

interface CreateTaskRequest extends AuthenticatedRequest {
    body: {
        title: string
        description?: string
        dueDate?: string
        priority?: TaskPriority
    }
}

interface UpdateTaskRequest extends AuthenticatedRequest {
    params: {
        id: string
    }
    body: {
        title?: string
        description?: string
        dueDate?: string
        priority?: TaskPriority
    }
}

interface GetTaskRequest extends AuthenticatedRequest {
    params: {
        id: string
    }
}

interface GetTasksRequest extends AuthenticatedRequest {
    query: {
        status?: TaskStatus
        priority?: TaskPriority
        sortBy?: 'dueDate' | 'priority'
        sortOrder?: 'ASC' | 'DESC'
        page?: number
        limit?: number
    }
}

interface AssignTaskRequest extends AuthenticatedRequest {
    params: {
        id: string
    }
    body: {
        assigneeId: string
    }
}

interface UpdateTaskStatusRequest extends AuthenticatedRequest {
    params: {
        id: string
    }
    body: {
        status: TaskStatus
    }
}

export async function createTask (request: CreateTaskRequest, reply: FastifyReply): Promise<void> {
    try {
        const { title, description, dueDate, priority } = request.body
        const { id: creatorId } = request.user

        const task = await taskService.createTask({
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            priority,
            creatorId
        })

        reply.code(201).send(task)
    } catch (error) {
        request.log.error(error)
        reply.code(500).send({ error: 'Internal server error' })
    }
}

export async function getTasks (request: GetTasksRequest, reply: FastifyReply): Promise<void> {
    try {
        const { status, priority, sortBy, sortOrder, page, limit } = request.query
        const { id: userId } = request.user

        const result = await taskService.getTasks({
            status,
            priority,
            sortBy,
            sortOrder,
            page,
            limit,
            userId
        })

        reply.send({
            tasks: result.tasks,
            total: result.total,
            page: page || 1,
            limit: limit || 10,
            totalPages: Math.ceil(result.total / (limit || 10))
        })
    } catch (error) {
        request.log.error(error)
        reply.code(500).send({ error: 'Internal server error' })
    }
}

export async function getTask (request: GetTaskRequest, reply: FastifyReply): Promise<void> {
    try {
        const { id } = request.params

        const task = await taskService.getTaskById(id)

        if (!task) {
            reply.code(404).send({ error: 'Task not found' })
            return
        }

        // Check if user has access to the task
        if (task.creatorId !== request.user.id && task.assigneeId !== request.user.id) {
            reply.code(403).send({ error: 'You do not have access to this task' })
            return
        }

        reply.send(task)
    } catch (error) {
        request.log.error(error)
        reply.code(500).send({ error: 'Internal server error' })
    }
}

export async function updateTask (request: UpdateTaskRequest, reply: FastifyReply): Promise<void> {
    try {
        const { id } = request.params
        const { title, description, dueDate, priority } = request.body

        const task = await taskService.getTaskById(id)

        if (!task) {
            reply.code(404).send({ error: 'Task not found' })
            return
        }

        // Check if user has access to update the task
        if (task.creatorId !== request.user.id && task.assigneeId !== request.user.id) {
            reply.code(403).send({ error: 'You do not have permission to update this task' })
            return
        }

        const [updated, tasks] = await taskService.updateTask(id, {
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            priority
        })

        if (updated === 0) {
            reply.code(404).send({ error: 'Task not found' })
            return
        }

        reply.send(tasks[0])
    } catch (error) {
        request.log.error(error)
        reply.code(500).send({ error: 'Internal server error' })
    }
}

export async function deleteTask (request: GetTaskRequest, reply: FastifyReply): Promise<void> {
    try {
        const { id } = request.params

        const task = await taskService.getTaskById(id)

        if (!task) {
            reply.code(404).send({ error: 'Task not found' })
            return
        }

        // Only creator can delete the task
        if (task.creatorId !== request.user.id) {
            reply.code(403).send({ error: 'You do not have permission to delete this task' })
            return
        }

        const deleted = await taskService.deleteTask(id)

        if (deleted === 0) {
            reply.code(404).send({ error: 'Task not found' })
            return
        }

        reply.code(204).send()
    } catch (error) {
        request.log.error(error)
        reply.code(500).send({ error: 'Internal server error' })
    }
}

export async function assignTask (request: AssignTaskRequest, reply: FastifyReply): Promise<void> {
    try {
        const { id } = request.params
        const { assigneeId } = request.body

        const task = await taskService.getTaskById(id)

        if (!task) {
            reply.code(404).send({ error: 'Task not found' })
            return
        }

        // Only creator can assign the task
        if (task.creatorId !== request.user.id) {
            reply.code(403).send({ error: 'You do not have permission to assign this task' })
            return
        }

        const [updated, tasks] = await taskService.assignTask(id, assigneeId)

        if (updated === 0) {
            reply.code(404).send({ error: 'Task not found' })
            return
        }

        reply.send(tasks[0])
    } catch (error) {
        request.log.error(error)
        reply.code(500).send({ error: 'Internal server error' })
    }
}

export async function updateTaskStatus (request: UpdateTaskStatusRequest, reply: FastifyReply): Promise<void> {
    try {
        const { id } = request.params
        const { status } = request.body

        const task = await taskService.getTaskById(id)

        if (!task) {
            reply.code(404).send({ error: 'Task not found' })
            return
        }

        // Check if user has access to update the task status
        if (task.creatorId !== request.user.id && task.assigneeId !== request.user.id) {
            reply.code(403).send({ error: 'You do not have permission to update this task' })
            return
        }

        const [updated, tasks] = await taskService.updateTaskStatus(id, status)

        if (updated === 0) {
            reply.code(404).send({ error: 'Task not found' })
            return
        }

        reply.send(tasks[0])
    } catch (error) {
        request.log.error(error)
        reply.code(500).send({ error: 'Internal server error' })
    }
}