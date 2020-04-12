import { CLOSE_TASK, CREATE_TASK, SET_CURRENT_LIST, SET_TASKS, UNDO_CLOSE_TASK, UPDATE_TASK, UPDATE_TASK_POSITION_INDEX } from '../actions/taskActions'

const emptyTaskList = () => ({
    content: [],
    last: true,
    totalElements: 0,
    number: -1
})

const INITIAL_STATE = {
    task: {},
    currentList: 'INBOX',
    INBOX: emptyTaskList(),
    CLOSED: emptyTaskList(),
    initialized: false,
    closed: false
}

const moveTaskSameList = (tasks, sourceIndex, destinationIndex) => {
    const task = tasks[sourceIndex]
    const updatedTasks = [...tasks]
    updatedTasks.splice(sourceIndex, 1)
    updatedTasks.splice(destinationIndex, 0, task)
    return updatedTasks
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
        return { ...state, tasks: [payload, ...state.tasks] }
    } else if (type === UPDATE_TASK_POSITION_INDEX) {
        const { sourceListType, sourceIndex, destinationIndex } = payload // TODO: destinationListType
        return {
            ...state,
            [sourceListType]: { ...state[sourceListType], content: moveTaskSameList(state[sourceListType].content, sourceIndex, destinationIndex) }
        }
    } else if (type === SET_TASKS) {
        const { list, tasks } = payload
        const { content, last, totalElements, number } = tasks
        return {
            ...state,
            [list]: { ...state[list], content: [...state[list].content, ...content], last, totalElements, number },
            initialized: true
        }
    } else if (type === CLOSE_TASK) {
        const { id } = payload
        const sourceList = state['INBOX'].content
        const destinationList = state['CLOSED'].content
        const { updatedSourceList, updatedDestinationList } = moveTask(sourceList, sourceList.findIndex(t => t.id === id), destinationList, 0)
        return {
            ...state,
            ['INBOX']: { ...state['INBOX'], content: updatedSourceList, totalElements: state['INBOX'].totalElements - 1 },
            ['CLOSED']: { ...state['CLOSED'], content: updatedDestinationList, totalElements: state['CLOSED'].totalElements + 1 }
        }
    } else if (type === UNDO_CLOSE_TASK) {
        const { id } = payload
        const sourceList = state['CLOSED'].content
        const destinationList = state['INBOX'].content
        const { updatedSourceList, updatedDestinationList } = moveTask(sourceList, sourceList.findIndex(t => t.id === id), destinationList, 0)
        return {
            ...state,
            ['INBOX']: { ...state['INBOX'], content: updatedDestinationList, totalElements: state['INBOX'].totalElements + 1 },
            ['CLOSED']: { ...state['CLOSED'], content: updatedSourceList, totalElements: state['CLOSED'].totalElements - 1 }
        }
    } else if (type === SET_CURRENT_LIST) {
        return { ...state, currentList: payload }
    } else if (type === UPDATE_TASK) {
        const tasks = []
        for (const task of state.tasks) {
            tasks.push(task.id === payload.id ? { ...task, ...payload } : task)
        }
        return { ...state, tasks, task: { ...state.task, ...payload } }
    } else {
        return state
    }
}
