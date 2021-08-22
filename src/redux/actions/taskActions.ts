import { ITask, ITaskPositionIndex, TaskListTypeAsLiterals } from '../../models/appModel'
import { ISearchUserTasksResponse } from '../../models/redux/taskServiceModel'
import { TaskAction, TaskListAction, TaskListTypeAction, TaskPositionIndexAction } from '../../models/redux/taskActionsModel'

export const SET_TASKS = 'SET_TASKS'
export const UPDATE_TASK_POSITION_INDEX = 'UPDATE_TASK_POSITION_INDEX'
export const CREATE_TASK = 'CREATE_TASK'
export const CLOSE_TASK = 'CLOSE_TASK'
export const UNDO_CLOSE_TASK = 'UNDO_CLOSE_TASK'
export const SET_CURRENT_LIST = 'SET_CURRENT_LIST'
export const UPDATE_TASK = 'UPDATE_TASK'

export const setTasksAction = (list: TaskListTypeAsLiterals, tasks: ISearchUserTasksResponse): TaskListAction =>
    ({ type: SET_TASKS, payload: { list, tasks } })

export const updateTaskPositionIndexAction =
    (taskPositionIndex: ITaskPositionIndex): TaskPositionIndexAction =>
        ({
            type: UPDATE_TASK_POSITION_INDEX,
            payload: taskPositionIndex
        })

export const createTaskAction = (task: ITask): TaskAction => ({ type: CREATE_TASK, payload: task })

export const closeTaskAction = (task: ITask): TaskAction => ({ type: CLOSE_TASK, payload: task })

export const undoCloseTaskAction = (task: ITask): TaskAction => ({ type: UNDO_CLOSE_TASK, payload: task })

export const updateTaskAction = (task: ITask): TaskAction => ({ type: UPDATE_TASK, payload: task })

export const setCurrentListAction = (currentList: TaskListTypeAsLiterals): TaskListTypeAction => ({
    type: SET_CURRENT_LIST,
    payload: currentList
})
