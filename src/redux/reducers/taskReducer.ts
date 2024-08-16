import {
    CLOSE_TASK,
    CREATE_TASK,
    SET_CURRENT_LIST,
    SET_TASKS,
    UNDO_CLOSE_TASK,
    UPDATE_TASK,
    UPDATE_TASK_POSITION_INDEX
} from '../actions/taskActions'
import { ITask, ITaskPositionIndex, TASK_LIST, TaskListTypeAsLiterals } from '../../models/appModel'
import { TaskListWithTotal, TasksState } from '../../models/redux/stateModel'
import {
    TaskAction,
    TaskListAction,
    TaskListTypeAction,
    TaskPositionIndexAction
} from '../../models/redux/taskActionsModel'
import { ISearchUserTasksResponse } from '../../models/redux/taskServiceModel'
import { copyOfListWithUpdatedTask } from '../../utils/lists'

const emptyTaskList = () => ({
    content: [],
    totalElements: 0,
    initialized: false
})

const INITIAL_STATE = {
    task: <ITask>{},
    currentList: TASK_LIST.INBOX,
    [TASK_LIST.INBOX]: emptyTaskList() as TaskListWithTotal,
    [TASK_LIST.CLOSED]: emptyTaskList() as TaskListWithTotal
}

const moveTaskSameList = (list: ITask[], sourceIndex: number, destinationIndex: number): ITask[] => {
    const task = list[sourceIndex]
    const updatedList = [...list]
    updatedList.splice(sourceIndex, 1)
    updatedList.splice(destinationIndex, 0, task)
    return updatedList
}

const moveTask = (sourceList: ITask[], sourceIndex: number, destinationList: ITask[], destinationIndex: number) => {
    const task = sourceList[sourceIndex]
    const updatedSourceList = [...sourceList]
    updatedSourceList.splice(sourceIndex, 1)
    const updatedDestinationList = [...destinationList]
    updatedDestinationList.splice(destinationIndex, 0, task)
    return { updatedSourceList, updatedDestinationList }
}

export default function (state: TasksState = INITIAL_STATE, action: TaskAction | TaskListAction | TaskListTypeAction | TaskPositionIndexAction) {
    const { type, payload } = action
    if (type === CREATE_TASK) {
        return {
            ...state,
            [TASK_LIST.INBOX]: {
                ...state[TASK_LIST.INBOX],
                content: [payload, ...state[TASK_LIST.INBOX].content],
                totalElements: state[TASK_LIST.INBOX].totalElements + 1
            }
        }
    } else if (type === UPDATE_TASK_POSITION_INDEX) {
        const { sourceListType, sourceIndex, destinationIndex } = payload as ITaskPositionIndex
        return {
            ...state,
            [sourceListType]: {
                ...state[sourceListType],
                content: moveTaskSameList(state[sourceListType].content, sourceIndex, destinationIndex)
            }
        }
    } else if (type === SET_TASKS) {
        const { list, tasks } = payload as { list: TaskListTypeAsLiterals; tasks: ISearchUserTasksResponse }
        const { content, page: { totalElements } } = tasks
        return {
            ...state,
            [list]: { ...state[list], content: [...state[list].content, ...content], totalElements, initialized: true }
        }
    } else if (type === CLOSE_TASK) {
        const sourceList = state[TASK_LIST.INBOX].content
        const destinationList = state[TASK_LIST.CLOSED].content
        const task = sourceList.findIndex(t => t.id === (<ITask>payload).id)
        const { updatedSourceList, updatedDestinationList } = moveTask(sourceList, task, destinationList, 0)
        return {
            ...state,
            [TASK_LIST.INBOX]: {
                ...state[TASK_LIST.INBOX],
                content: updatedSourceList,
                totalElements: state[TASK_LIST.INBOX].totalElements - 1
            },
            [TASK_LIST.CLOSED]: {
                ...state[TASK_LIST.CLOSED],
                content: updatedDestinationList,
                totalElements: state[TASK_LIST.CLOSED].totalElements + 1
            }
        }
    } else if (type === UNDO_CLOSE_TASK) {
        const sourceList = state[TASK_LIST.CLOSED].content
        const destinationList = state[TASK_LIST.INBOX].content
        const task = sourceList.findIndex(t => t.id === (<ITask>payload).id)
        const { updatedSourceList, updatedDestinationList } = moveTask(sourceList, task, destinationList, 0)
        return {
            ...state,
            [TASK_LIST.INBOX]: {
                ...state[TASK_LIST.INBOX],
                content: updatedDestinationList,
                totalElements: state[TASK_LIST.INBOX].totalElements + 1
            },
            [TASK_LIST.CLOSED]: {
                ...state[TASK_LIST.CLOSED],
                content: updatedSourceList,
                totalElements: state[TASK_LIST.CLOSED].totalElements - 1
            }
        }
    } else if (type === SET_CURRENT_LIST) {
        return { ...state, currentList: payload }
    } else if (type === UPDATE_TASK) {
        const { currentList } = state
        return {
            ...state,
            [currentList]: {
                ...state[currentList],
                content: copyOfListWithUpdatedTask(state[currentList].content, <ITask>payload)
            },
            task: { ...state.task, ...<ITask>payload }
        }
    } else {
        return state
    }
}
