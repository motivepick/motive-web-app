import { CLOSE_TASK, CREATE_TASK, SET_TASKS, TOGGLE_OPEN_CLOSED_TASKS, UNDO_CLOSE_TASK, UPDATE_TASK, UPDATE_TASK_POSITION_INDEX } from '../actions/taskActions'

const INITIAL_STATE = {
    task: {},
    tasks: {
        content: [],
        number: -1
    },
    initialized: false,
    closed: false
}

const moveTask = (tasks, sourceIndex, destinationIndex) => {
    const task = tasks[sourceIndex]
    const updatedTasks = [...tasks]
    updatedTasks.splice(sourceIndex, 1)
    updatedTasks.splice(destinationIndex, 0, task)
    return updatedTasks
}

export default function (state = INITIAL_STATE, action) {
    const { type, payload } = action
    if (type === CREATE_TASK) {
        return { ...state, tasks: [payload, ...state.tasks] }
    } else if (type === UPDATE_TASK_POSITION_INDEX) {
        const { sourceIndex, destinationIndex } = payload
        return { ...state, tasks: { ...state.tasks, content: moveTask(state.tasks.content, sourceIndex, destinationIndex) } }
    } else if (type === SET_TASKS) {
        const { content, last, number } = payload
        return {
            ...state,
            tasks: { ...state.tasks, content: [...state.tasks.content, ...content], last, number },
            initialized: true
        }
    } else if (type === CLOSE_TASK) {
        const { id, closingDate } = payload
        return { ...state, tasks: state.tasks.map(t => t.id === id ? { ...t, closed: true, closingDate } : t) }
    } else if (type === UNDO_CLOSE_TASK) {
        const { id, created } = payload
        return { ...state, tasks: state.tasks.map(t => t.id === id ? { ...t, closed: false, created } : t) }
    } else if (type === TOGGLE_OPEN_CLOSED_TASKS) {
        return { ...state, closed: payload }
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
