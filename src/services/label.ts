import { Label } from '../models/Label'
import { Task } from '../models/Task'

export async function findOrCreateLabels (labelNames: string[]): Promise<Label[]> {
    const labels: Label[] = []

    for (const name of labelNames) {
        const [label] = await Label.findOrCreate({
            where: { name }
        })

        labels.push(label)
    }

    return labels
}

export async function addLabelsToTask (taskId: string, labelNames: string[]): Promise<void> {
    const task = await Task.findByPk(taskId)

    if (!task) {
        throw new Error('Task not found')
    }

    const labels = await findOrCreateLabels(labelNames)
    await task.$add('labels', labels)
}

export async function removeLabelFromTask (taskId: string, labelId: string): Promise<void> {
    const task = await Task.findByPk(taskId)

    if (!task) {
        throw new Error('Task not found')
    }

    await task.$remove('labels', labelId)
}