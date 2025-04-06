import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript'
import { Task } from './Task'
import { Label } from './Label'

@Table({
    tableName: 'task_labels',
    timestamps: true
})
export class TaskLabel extends Model {
    @ForeignKey(() => Task)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true
    })
    taskId!: string

    @ForeignKey(() => Label)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true
    })
    labelId!: string
}