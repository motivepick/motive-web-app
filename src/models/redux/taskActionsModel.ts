import { ITask, ITaskPositionIndex, TaskListTypeAsLiterals } from '../appModel'
import { ISearchUserTasksResponse } from './taskServiceModel'

export type TaskAction = { type: string; payload: ITask; }
export type TaskListAction = { type: string; payload: { list: TaskListTypeAsLiterals; tasks: ISearchUserTasksResponse }; }
export type TaskListTypeAction = { type: string; payload: TaskListTypeAsLiterals; }
export type TaskPositionIndexAction = { type: string; payload: ITaskPositionIndex; }
