import { CLOSE_TASK, CREATE_TASK, SET_TASKS, TOGGLE_OPEN_CLOSED_TASKS, UNDO_CLOSE_TASK, UPDATE_TASK, UPDATE_TASK_POSITION_INDEX } from '../actions/taskActions'

const INITIAL_STATE = {
    task: {},
    tasks: [],
    initialized: false,
    closed: false
}

export default function (state = INITIAL_STATE, action) {
    const { type, payload } = action
    if (type === CREATE_TASK) {
        return { ...state, tasks: [payload, ...state.tasks] }
    } else if (type === UPDATE_TASK_POSITION_INDEX) {
        const tasks = state.closed ? state.tasks.filter(t => t.closed) : state.tasks.filter(t => !t.closed)
        const { sourceIndex, destinationIndex, draggableId } = payload
        const sourceId = tasks[sourceIndex].id
        const destinationId = tasks[destinationIndex].id
        const realSourceIndex = state.tasks.findIndex(t => t.id === sourceId)
        const realDestinationIndex = state.tasks.findIndex(t => t.id === destinationId)
        const updatedTasks = [...state.tasks]
        updatedTasks.splice(realSourceIndex, 1)
        updatedTasks.splice(realDestinationIndex, 0, state.tasks.find(t => t.id.toString() === draggableId))
        return { ...state, tasks: updatedTasks }
    } else if (type === SET_TASKS) {
        return { ...state, tasks: payload, initialized: true }
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
