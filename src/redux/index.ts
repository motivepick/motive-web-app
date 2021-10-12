import { useDispatch } from 'react-redux'
import { useCallback } from 'react'

import TaskService from '../services/taskService'
import { handleServerException } from '../utils/exceptionHandler'
import { ICreateTaskRequest } from '../models/redux/taskServiceModel'
import { createTaskAction, setCurrentListAction } from './actions/taskActions'

export const useTasksStore = () => {
    const dispatch = useDispatch()

    const createTask = useCallback(async (task: ICreateTaskRequest) => {
        try {
            dispatch(createTaskAction(await TaskService.createTask(task)))
        } catch (e) {
            handleServerException(e)
        }
    }, [dispatch])

    const setTaskList = useCallback(
        taskList => dispatch(setCurrentListAction(taskList)),
        [dispatch]
    )

    return {
        createTask,
        setTaskList
    }
}
