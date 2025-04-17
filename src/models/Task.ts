import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript'
import { User } from './User'
import { Label } from './Label'
import { TaskLabel } from './TaskLabel'


export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export enum TaskStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

@Table({
    tableName: 'tasks'
})
export class Task extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })

    id!: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title!: string

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    description?: string

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    dueDate?: Date

    @Column({
        type: DataType.ENUM(...Object.values(TaskPriority)),
        defaultValue: TaskPriority.MEDIUM
    })
    priority!: TaskPriority

    @Column({
        type: DataType.ENUM(...Object.values(TaskStatus)),
        defaultValue: TaskStatus.OPEN
    })
    status!: TaskStatus

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    creatorId!: string

    @BelongsTo(() => User, 'creatorId')
    creator!: User

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    assigneeId?: string

    @BelongsTo(() => User, 'assigneeId')
    assignee?: User

    @BelongsToMany(() => Label, () => TaskLabel)
    labels!: Label[]
}