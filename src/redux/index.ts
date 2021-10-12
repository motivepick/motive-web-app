import { useDispatch } from 'react-redux'
import { useCallback } from 'react'

import TaskService from '../services/taskService'
import { handleServerException } from '../utils/exceptionHandler'
import { ICreateTaskRequest, IUpdateTaskRequest } from '../models/redux/taskServiceModel'
import { createTaskAction, setCurrentListAction, updateTaskAction } from './actions/taskActions'

export const useTasksStore = () => {
    const dispatch = useDispatch()

    const createTask = useCallback(async (task: ICreateTaskRequest) => {
        try {
            dispatch(createTaskAction(await TaskService.createTask(task)))
        } catch (e) {
            handleServerException(e)
        }
    }, [dispatch])

    const updateTask = useCallback(async (id: number, task: IUpdateTaskRequest) => {
        try {
            dispatch(updateTaskAction(await TaskService.updateTask(id, task)))
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
        updateTask,
        setTaskList
    }
}
