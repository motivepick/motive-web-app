import { ITask, ITaskPositionIndex, TASK_LIST, TaskListTypeAsLiterals } from '../../models/appModel'
import { ICreateTaskRequest, ISearchUserTasksResponse } from '../../models/redux/taskServiceModel'
import { TaskAction, TaskListAction, TaskListTypeAction, TaskPositionIndexAction } from '../../models/redux/taskActionsModel'
import { handleServerException } from '../../utils/exceptionHandler'
import { selectCurrentList, selectTaskList } from '../selectors/taskSelectors'
import api from '../../services/taskService'
import { DEFAULT_LIMIT } from '../../config'
import { delay, DELAY_MS } from '../../utils/delay'

export const SET_TASKS = 'SET_TASKS'
export const UPDATE_TASK_POSITION_INDEX = 'UPDATE_TASK_POSITION_INDEX'
export const CREATE_TASK = 'CREATE_TASK'
export const CLOSE_TASK = 'CLOSE_TASK'
export const UNDO_CLOSE_TASK = 'UNDO_CLOSE_TASK'
export const SET_CURRENT_LIST = 'SET_CURRENT_LIST'
export const UPDATE_TASK = 'UPDATE_TASK'

export const setTasksAction = (list: TaskListTypeAsLiterals, tasks: ISearchUserTasksResponse): TaskListAction =>
    ({ type: SET_TASKS, payload: { list, tasks } })

export const updateTaskPositionIndexAction = (taskPositionIndex: ITaskPositionIndex): TaskPositionIndexAction =>
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

export const setTasks = (list: TaskListTypeAsLiterals) => {
    // @ts-ignore
    return async (dispatch, getState) => {
        const offset = selectTaskList(getState(), list).content.length
        try {
            dispatch(setTasksAction(list, await api.searchUserTasks(list, offset, DEFAULT_LIMIT)))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const updateTaskIndex = ({ sourceListType, sourceIndex, destinationListType, destinationIndex }: ITaskPositionIndex) => {
    // @ts-ignore
    return async (dispatch) => {
        dispatch(updateTaskPositionIndexAction({ sourceListType, sourceIndex, destinationListType, destinationIndex }))
        await api.updateTasksOrderAsync({ sourceListType, sourceIndex, destinationListType, destinationIndex })
    }
}

export const createTask = (task: ICreateTaskRequest) => {
    // @ts-ignore
    return async (dispatch) => {
        try {
            dispatch(createTaskAction(await api.createTask(task)))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const updateTask = (id: number, task: ITask) => {
    // @ts-ignore
    return async (dispatch) => {
        try {
            dispatch(updateTaskAction(await api.updateTask(id, task)))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const closeOrUndoCloseTask = (id: number) => {
    // @ts-ignore
    return async (dispatch, getState) => {
        const currentList = selectCurrentList(getState())
        try {
            const service = currentList === TASK_LIST.INBOX ? api.closeTask : api.undoCloseTask
            const action = currentList === TASK_LIST.INBOX ? closeTaskAction : undoCloseTaskAction
            const values = await Promise.all([service(id), delay(DELAY_MS)])
            dispatch(action(values[0]))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const setCurrentTaskListToInbox = () => {
    // @ts-ignore
    return dispatch => {
        dispatch(setCurrentListAction(TASK_LIST.INBOX))
    }
}

export const toggleCurrentTaskList = () => {
    // @ts-ignore
    return (dispatch, getState) => {
        dispatch(setCurrentListAction(selectCurrentList(getState()) === TASK_LIST.INBOX ? TASK_LIST.CLOSED : TASK_LIST.INBOX))
    }
}
