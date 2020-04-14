import { CLOSE_TASK, CREATE_TASK, SET_CURRENT_LIST, SET_TASKS, UNDO_CLOSE_TASK, UPDATE_TASK, UPDATE_TASK_POSITION_INDEX } from '../actions/taskActions'
import { TASK_LIST } from '../const'
import { copyOfListWithUpdatedTask } from '../utils/lists'

const emptyTaskList = () => ({
    content: [],
    totalElements: 0
})

const INITIAL_STATE = {
    task: {},
    currentList: TASK_LIST.INBOX,
    [TASK_LIST.INBOX]: emptyTaskList(),
    [TASK_LIST.CLOSED]: emptyTaskList(),
    initialized: false
}

const moveTaskSameList = (list, sourceIndex, destinationIndex) => {
    const task = list[sourceIndex]
    const updatedList = [...list]
    updatedList.splice(sourceIndex, 1)
    updatedList.splice(destinationIndex, 0, task)
    return updatedList
}

const moveTask = (sourceList, sourceIndex, destinationList, destinationIndex) => {
    const task = sourceList[sourceIndex]
    const updatedSourceList = [...sourceList]
    updatedSourceList.splice(sourceIndex, 1)
    const updatedDestinationList = [...destinationList]
    updatedDestinationList.splice(destinationIndex, 0, task)
    return { updatedSourceList, updatedDestinationList }
}

export default function (state = INITIAL_STATE, action) {
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
        const { sourceListType, sourceIndex, destinationIndex } = payload
        return {
            ...state,
            [sourceListType]: { ...state[sourceListType], content: moveTaskSameList(state[sourceListType].content, sourceIndex, destinationIndex) }
        }
    } else if (type === SET_TASKS) {
        const { list, tasks } = payload
        const { content, totalElements } = tasks
        return {
            ...state,
            [list]: { ...state[list], content: [...state[list].content, ...content], totalElements },
            initialized: true
        }
    } else if (type === CLOSE_TASK) {
        const sourceList = state[TASK_LIST.INBOX].content
        const destinationList = state[TASK_LIST.CLOSED].content
        const task = sourceList.findIndex(t => t.id === payload.id)
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
        const task = sourceList.findIndex(t => t.id === payload.id)
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
                content: copyOfListWithUpdatedTask(state[currentList].content, payload)
            },
            task: { ...state.task, ...payload }
        }
    } else {
        return state
    }
}
