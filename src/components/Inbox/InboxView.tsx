import React, { FC, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentTaskListToInbox, toggleCurrentTaskList } from '../../redux/reducers/taskListSlice'
import { AppDispatch, RootState } from '../../redux/store'
import {
    useCloseTaskMutation,
    useCreateTaskMutation,
    useSearchClosedTasksQuery,
    useSearchInboxTasksQuery,
    useUndoCloseTaskMutation,
    useUpdateTaskMutation,
    useUpdateTasksOrderAsyncMutation
} from '../../redux/taskApi'
import DroppableTaskListWithHeader from '../Schedule/DroppableTaskListWithHeader'
import AddNewTask from './AddNewTask'
import { dateFromRelativeString } from '../../utils/date-from-relative-string'
import SpinnerView from '../common/Spinner'
import TasksSubtitle from '../common/TasksSubtitle'
import InfiniteScroll from 'react-infinite-scroll-component'
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import { ITask, TASK_LIST } from '../../models/appModel'
import { useTranslation } from 'react-i18next'

const InboxView: FC = () => {
    const currentList = useSelector((state: RootState) => state.taskLists.currentList)
    const currentTaskCount = useSelector((state: RootState) => state.taskLists[`totalElements${state.taskLists.currentList}`])
    const currentTasks = useSelector((state: RootState) => state.tasks[state.taskLists.currentList])

    const [createTaskMutation] = useCreateTaskMutation()
    const [closeTaskMutation] = useCloseTaskMutation()
    const [undoCloseTaskMutation] = useUndoCloseTaskMutation()
    const [updateTaskMutation] = useUpdateTaskMutation()
    const [updateTasksOrderAsyncMutation] = useUpdateTasksOrderAsyncMutation()

    const dispatch = useDispatch<AppDispatch>()

    const [offsetInbox, setOffsetInbox] = useState(0)
    const [offsetClosed, setOffsetClosed] = useState(0)
    const { isLoading: isLoadingInbox } = useSearchInboxTasksQuery({ offset: offsetInbox, limit: 20 })
    const { isLoading: isLoadingClosed } = useSearchClosedTasksQuery({ offset: offsetClosed, limit: 20 })

    const onAddNewTask = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
        const task = dateFromRelativeString({ name: (e.target as HTMLInputElement).value.trim() } as ITask)
        dispatch(setCurrentTaskListToInbox())
        createTaskMutation(task)
    }, [dispatch, setCurrentTaskListToInbox, createTaskMutation])

    const closeOrUndoCloseTask = useCallback(async (id: number) => {
        if (currentList === TASK_LIST.INBOX) {
            closeTaskMutation(id)
        } else {
            undoCloseTaskMutation(id)
        }
    }, [currentList, closeTaskMutation, undoCloseTaskMutation])

    const updateTask = useCallback(async (id: number, task: ITask) => {
        updateTaskMutation({ id, task })
    }, [updateTaskMutation])

    const updateTaskPositionIndex: OnDragEndResponder = useCallback((result) => {
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination!)) {
            updateTasksOrderAsyncMutation({
                sourceListType: TASK_LIST[source.droppableId as keyof typeof TASK_LIST],
                sourceIndex: source.index,
                destinationListType: TASK_LIST[source.droppableId as keyof typeof TASK_LIST],
                destinationIndex: destination!.index
            })
        }
    }, [updateTasksOrderAsyncMutation])

    const onToggleOpenClosedTasks = useCallback(() => dispatch(toggleCurrentTaskList()), [dispatch, toggleCurrentTaskList])

    const loadMore = useCallback(() => {
        if (currentList === TASK_LIST.INBOX) {
            setOffsetInbox(offsetInbox + 20)
        } else {
            setOffsetClosed(offsetClosed + 20)
        }
    }, [offsetInbox, offsetClosed, currentList])
    const { t } = useTranslation()
    return (
        <>
            <AddNewTask onAddNewTask={onAddNewTask}/>
            <TasksSubtitle numberOfTasks={currentTaskCount} currentList={currentList} onToggleOpenClosedTasks={onToggleOpenClosedTasks}/>
            {!isLoadingInbox ? <DragDropContext onDragEnd={updateTaskPositionIndex}>
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
                            droppableId={currentList}
                            isDraggable
                            tasks={currentTasks}
                            onSaveTask={updateTask}
                            onTaskClose={closeOrUndoCloseTask}
                        />
                    </InfiniteScroll>
                </DragDropContext> : <SpinnerView/>}
        </>
    )
}

export default InboxView
