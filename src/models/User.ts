import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript'
import { Task } from './Task'

@Table({
    tableName: 'users'
})
export class User extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    // @ts-ignore
    id!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    })
    email!: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password!: string

    @HasMany(() => Task, 'creatorId')
    createdTasks!: Task[]

    @HasMany(() => Task, 'assigneeId')
    assignedTasks!: Task[]
}