import React, { FC, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTaskListId, toggleTaskListId } from '../../redux/reducers/taskListsSlice'
import { AppDispatch } from '../../redux/store'
import {
    useCloseTaskMutation,
    useCreateTaskMutation,
    useFetchTaskListQuery,
    useReopenTaskMutation,
    useUpdateTaskMutation,
    useUpdateTasksOrderAsyncMutation
} from '../../redux/api'
import DroppableTaskListWithHeader from '../Schedule/DroppableTaskListWithHeader'
import AddNewTask from './AddNewTask'
import { extractDueDate } from '../../utils/extractDueDate'
import SpinnerView from '../common/Spinner'
import TasksSubtitle from '../common/TasksSubtitle'
import InfiniteScroll from 'react-infinite-scroll-component'
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import { TASK_LIST_ID, UpdateTaskRequest } from '../../models/appModel'
import { useTranslation } from 'react-i18next'
import { DEFAULT_LIMIT } from '../../config'
import { selectTaskListId, selectTaskListInitialized, selectTaskListTasks, selectTotalElements } from '../../redux/selectors/selectors'

const InboxView: FC = () => {
    const taskListId = useSelector(selectTaskListId)
    const initialized = useSelector(selectTaskListInitialized)
    const currentTaskCount = useSelector(selectTotalElements)
    const currentTasks = useSelector(selectTaskListTasks)

    const [createTaskMutation] = useCreateTaskMutation()
    const [closeTaskMutation] = useCloseTaskMutation()
    const [reopenTaskMutation] = useReopenTaskMutation()
    const [updateTaskMutation] = useUpdateTaskMutation()
    const [updateTasksOrderAsyncMutation] = useUpdateTasksOrderAsyncMutation()

    const dispatch = useDispatch<AppDispatch>()

    const [offsetInbox, setOffsetInbox] = useState(0)
    const [offsetClosed, setOffsetClosed] = useState(0)
    useFetchTaskListQuery({ taskListId, offset: taskListId === TASK_LIST_ID.INBOX ? offsetInbox : offsetClosed, limit: DEFAULT_LIMIT })

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
        if (userReallyChangedOrder(source, destination!)) {
            updateTasksOrderAsyncMutation({
                sourceListType: TASK_LIST_ID[source.droppableId as keyof typeof TASK_LIST_ID],
                sourceIndex: source.index,
                destinationListType: TASK_LIST_ID[source.droppableId as keyof typeof TASK_LIST_ID],
                destinationIndex: destination!.index
            })
        }
    }, [updateTasksOrderAsyncMutation])

    const onToggleOpenClosedTasks = useCallback(() => dispatch(toggleTaskListId()), [dispatch, toggleTaskListId])

    const loadMore = useCallback(() => {
        if (taskListId === TASK_LIST_ID.INBOX) {
            setOffsetInbox(offsetInbox + DEFAULT_LIMIT)
        } else {
            setOffsetClosed(offsetClosed + DEFAULT_LIMIT)
        }
    }, [offsetInbox, offsetClosed, taskListId])
    const { t } = useTranslation()
    return (
        <>
            <AddNewTask onAddNewTask={onAddNewTask}/>
            <TasksSubtitle numberOfTasks={currentTaskCount} taskListId={taskListId} onToggleOpenClosedTasks={onToggleOpenClosedTasks}/>
            {initialized ? <DragDropContext onDragEnd={updateTaskPositionIndex}>
                {currentTaskCount === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                    <img src={t('noTasksImg')} className="d-inline-block align-center" alt={t('noTasksAlt')}/>
                </div>}
                <InfiniteScroll
                    dataLength={currentTasks.length}
                    next={loadMore}
                    hasMore={currentTasks.length < currentTaskCount}
                    loader={<h4>Loading...</h4>}
                >
                    <DroppableTaskListWithHeader
                        droppableId={taskListId}
                        isDraggable
                        tasks={currentTasks}
                        onSaveTask={updateTask}
                        onTaskClose={closeOrReopenTask}
                    />
                </InfiniteScroll>
            </DragDropContext> : <SpinnerView/>}
        </>
    )
}

export default InboxView
