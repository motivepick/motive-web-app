// @ts-nocheck
import { ITask, ITaskPositionIndex, TASK_LIST, TaskListTypeAsLiterals } from '../../models/appModel'
import { ISearchUserTasksResponse } from '../../models/redux/taskServiceModel'
import { TaskAction, TaskListAction, TaskListTypeAction, TaskPositionIndexAction } from '../../models/redux/taskActionsModel'
import { setUserAction } from './userActions'
import { fetchUser } from '../../services/userService'
import { handleServerException } from '../../utils/exceptionHandler'
import { selectCurrentList, selectTaskList } from '../selectors/taskSelectors'
import { closeTask, createTaskApi, searchUserTasks, undoCloseTask, updateTaskApi, updateTasksOrderAsync } from '../../services/taskService'
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

export const setUser = () => {
    return async (dispatch) => {
        try {
            dispatch(setUserAction(await fetchUser()))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const setTasks = (list) => {
    return async (dispatch, getState) => {
        const offset = selectTaskList(getState(), list).content.length
        try {
            dispatch(setTasksAction(list, await searchUserTasks(list, offset, DEFAULT_LIMIT)))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const updateTaskIndex = (sourceListType, sourceIndex, destinationListType, destinationIndex) => {
    return async (dispatch) => {
        dispatch(updateTaskPositionIndexAction({ sourceListType, sourceIndex, destinationListType, destinationIndex }))
        await updateTasksOrderAsync({ sourceListType, sourceIndex, destinationListType, destinationIndex })
    }
}

export const createTask = task => {
    return async (dispatch) => {
        try {
            dispatch(createTaskAction(await createTaskApi(task)))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const updateTask = (id, task) => {
    return async (dispatch) => {
        try {
            dispatch(updateTaskAction(await updateTaskApi(id, task)))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const closeOrUndoCloseTask = (id) => {
    return async (dispatch, getState) => {
        const currentList = selectCurrentList(getState())
        try {
            const service = currentList === TASK_LIST.INBOX ? closeTask : undoCloseTask
            const action = currentList === TASK_LIST.INBOX ? closeTaskAction : undoCloseTaskAction
            const values = await Promise.all([service(id), delay(DELAY_MS)])
            dispatch(action(values[0]))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const setCurrentTaskListToInbox = () => {
    return dispatch => {
        dispatch(setCurrentListAction(TASK_LIST.INBOX))
    }
}

export const toggleCurrentTaskList = () => {
    return (dispatch, getState) => {
        dispatch(setCurrentListAction(selectCurrentList(getState()) === TASK_LIST.INBOX ? TASK_LIST.CLOSED : TASK_LIST.INBOX))
    }
}
