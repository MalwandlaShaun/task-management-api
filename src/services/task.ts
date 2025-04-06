import { Op } from 'sequelize'
import { Task, TaskPriority, TaskStatus } from '../models/Task'
import { User } from '../models/User'
import { Label } from '../models/Label'

export interface CreateTaskData {
    title: string
    description?: string
    dueDate?: Date
    priority?: TaskPriority
    creatorId: string
}

export interface UpdateTaskData {
    title?: string
    description?: string
    dueDate?: Date
    priority?: TaskPriority
}

export interface TaskFilters {
    status?: TaskStatus
    priority?: TaskPriority
    sortBy?: 'dueDate' | 'priority'
    sortOrder?: 'ASC' | 'DESC'
    page?: number
    limit?: number
    userId?: string
}

export async function createTask (data: CreateTaskData): Promise<Task> {
    return await Task.create(data)
}

export async function getTasks (filters: TaskFilters): Promise<{ tasks: Task[], total: number }> {
    const { status, priority, sortBy, sortOrder, page = 1, limit = 10, userId } = filters

    const where: any = {}

    if (status) {
        where.status = status
    }

    if (priority) {
        where.priority = priority
    }

    if (userId) {
        where[Op.or] = [
            { creatorId: userId },
            { assigneeId: userId }
        ]
    }

    const order: any = []

    if (sortBy) {
        order.push([sortBy, sortOrder || 'ASC'])
    } else {
        order.push(['createdAt', 'DESC'])
    }

    const offset = (page - 1) * limit

    const { count, rows } = await Task.findAndCountAll({
        where,
        order,
        limit,
        offset,
        include: [
            { model: User, as: 'creator', attributes: ['id', 'email'] },
            { model: User, as: 'assignee', attributes: ['id', 'email'] },
            { model: Label, through: { attributes: [] } }
        ]
    })

    return {
        tasks: rows,
        total: count
    }
}

export async function getTaskById (id: string): Promise<Task | null> {
    return await Task.findByPk(id, {
        include: [
            { model: User, as: 'creator', attributes: ['id', 'email'] },
            { model: User, as: 'assignee', attributes: ['id', 'email'] },
            { model: Label, through: { attributes: [] } }
        ]
    })
}

export async function updateTask (id: string, data: UpdateTaskData): Promise<[number, Task[]]> {
    return await Task.update(data, {
        where: { id },
        returning: true
    })
}

export async function deleteTask (id: string): Promise<number> {
    return await Task.destroy({
        where: { id }
    })
}

export async function assignTask (id: string, assigneeId: string): Promise<[number, Task[]]> {
    return await Task.update({ assigneeId }, {
        where: { id },
        returning: true
    })
}

export async function updateTaskStatus (id: string, status: TaskStatus): Promise<[number, Task[]]> {
    return await Task.update({ status }, {
        where: { id },
        returning: true
    })
}