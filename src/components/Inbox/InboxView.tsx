import React, { FC, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTaskLists, setTaskListId, toggleTaskListId } from '../../redux/reducers/tasksSlice'
import { AppDispatch } from '../../redux/store'
import { useCloseTaskMutation, useCreateTaskMutation, useReopenTaskMutation, useUpdateTaskMutation, useUpdateTasksOrderAsyncMutation } from '../../redux/api'
import DroppableTaskListWithHeader from '../Schedule/DroppableTaskListWithHeader'
import AddNewTask from './AddNewTask'
import { extractDueDate } from '../../utils/extractDueDate'
import SpinnerView from '../common/Spinner'
import TasksSubtitle from '../common/TasksSubtitle'
import InfiniteScroll from 'react-infinite-scroll-component'
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import { TASK_LIST_ID, UpdateTaskRequest } from '../../models/appModel'
import { selectTaskListId, selectTaskListLength, selectTaskListStatus, selectTaskListTasks, selectTaskListTotalElements } from '../../redux/selectors/selectors'
import { DEFAULT_LIMIT } from '../../config'
import NoTasksImage from '../common/NoTasksImage'

const InboxView: FC = () => {
    const taskListId = useSelector(selectTaskListId)
    const taskListStatus = useSelector(selectTaskListStatus)

    const [createTaskMutation] = useCreateTaskMutation()
    const [closeTaskMutation] = useCloseTaskMutation()
    const [reopenTaskMutation] = useReopenTaskMutation()
    const [updateTaskMutation] = useUpdateTaskMutation()
    const [updateTasksOrderAsyncMutation] = useUpdateTasksOrderAsyncMutation()

    const dispatch = useDispatch<AppDispatch>()

    const onAddNewTask = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
        const task = extractDueDate((e.target as HTMLInputElement).value.trim())
        dispatch(setTaskListId(TASK_LIST_ID.INBOX))
        createTaskMutation(task)
    }, [dispatch, setTaskListId, createTaskMutation])

    const closeOrReopenTask = useCallback(async (id: number) => {
        if (taskListId === TASK_LIST_ID.INBOX) {
            closeTaskMutation(id)
        } else {
            reopenTaskMutation(id)
        }
    }, [taskListId, closeTaskMutation, reopenTaskMutation])

    const updateTask = useCallback(async (id: number, request: UpdateTaskRequest) => {
        updateTaskMutation({ id, request })
    }, [updateTaskMutation])

    const updateTaskPositionIndex: OnDragEndResponder = useCallback((result) => {
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination)) {
            updateTasksOrderAsyncMutation({
                sourceListType: source.droppableId,
                sourceIndex: source.index,
                destinationListType: source.droppableId,
                destinationIndex: destination!.index
            })
        }
    }, [updateTasksOrderAsyncMutation])

    const onToggleOpenClosedTasks = useCallback(() => dispatch(toggleTaskListId()), [dispatch, toggleTaskListId])

    useEffect(() => {
        if (taskListStatus === 'IDLE') dispatch(fetchTaskLists({ type: taskListId, offset: 0, limit: DEFAULT_LIMIT }))
    }, [taskListStatus, taskListId])

    const taskListTotalElements = useSelector(selectTaskListTotalElements)
    const taskListTasks = useSelector(selectTaskListTasks)
    const taskListLength = useSelector(selectTaskListLength)

    const initialized = ['SUCCEEDED', 'FAILED'].includes(taskListStatus) || taskListLength > 0
    return (
        <>
            <AddNewTask onAddNewTask={onAddNewTask}/>
            <TasksSubtitle
                showNumberOfTasks={initialized}
                numberOfTasks={taskListTotalElements}
                taskListId={taskListId}
                onToggleOpenClosedTasks={onToggleOpenClosedTasks}
            />
            {initialized ? <DragDropContext onDragEnd={updateTaskPositionIndex}>
                {taskListStatus === 'SUCCEEDED' && taskListTotalElements === 0 && <NoTasksImage/>}
                <InfiniteScroll
                    dataLength={taskListTasks.length}
                    next={() => dispatch(fetchTaskLists({ type: taskListId, offset: taskListLength, limit: DEFAULT_LIMIT }))}
                    hasMore={taskListTasks.length < taskListTotalElements}
                    loader={<h4>Loading...</h4>}
                >
                    {taskListTasks.length > 0 &&
                        <DroppableTaskListWithHeader
                            droppableId={taskListId}
                            isDraggable
                            tasks={taskListTasks}
                            onSaveTask={updateTask}
                            onTaskClose={closeOrReopenTask}
                        />}
                </InfiniteScroll>
            </DragDropContext> : <SpinnerView/>}
        </>
    )
}

export default InboxView
