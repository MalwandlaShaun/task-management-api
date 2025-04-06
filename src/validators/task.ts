import { TaskPriority, TaskStatus } from '../models/Task'

export const createTaskSchema = {
    body: {
        type: 'object',
        required: ['title'],
        properties: {
            title: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            priority: { type: 'string', enum: Object.values(TaskPriority) }
        }
    }
}

export const updateTaskSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' }
        }
    },
    body: {
        type: 'object',
        properties: {
            title: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            priority: { type: 'string', enum: Object.values(TaskPriority) }
        }
    }
}

export const updateTaskStatusSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' }
        }
    },
    body: {
        type: 'object',
        required: ['status'],
        properties: {
            status: { type: 'string', enum: Object.values(TaskStatus) }
        }
    }
}

export const assignTaskSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' }
        }
    },
    body: {
        type: 'object',
        required: ['assigneeId'],
        properties: {
            assigneeId: { type: 'string', format: 'uuid' }
        }
    }
}

export const getTasksQuerySchema = {
    querystring: {
        type: 'object',
        properties: {
            status: { type: 'string', enum: Object.values(TaskStatus) },
            priority: { type: 'string', enum: Object.values(TaskPriority) },
            sortBy: { type: 'string', enum: ['dueDate', 'priority'] },
            sortOrder: { type: 'string', enum: ['ASC', 'DESC'] },
            page: { type: 'integer', minimum: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100 }
        }
    }
}