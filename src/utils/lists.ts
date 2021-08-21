import { ITask } from '../models'

export const copyOfListWithUpdatedTask = (tasks: ITask[], task: ITask): ITask[] => {
    const result: ITask[] = []
    for (const t of tasks) {
        result.push(t.id === task.id ? { ...t, ...task } : t)
    }
    return result
}
