// @ts-nocheck
import React, { FC, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DroppableTaskListWithHeader from '../Schedule/DroppableTaskListWithHeader'
import AddNewTask from './AddNewTask'
import { dateFromRelativeString } from '../../utils/date-from-relative-string'
import SpinnerView from '../common/Spinner'
import TasksSubtitle from '../common/TasksSubtitle'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
    closeOrUndoCloseTask,
    createTask,
    setCurrentTaskListToInbox,
    setTasks,
    toggleCurrentTaskList,
    updateTask,
    updateTaskIndex
} from '../../redux/actions/taskActions'
import { DragDropContext } from '@hello-pangea/dnd'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import { selectCurrentList, selectTaskLists } from '../../redux/selectors/taskSelectors'

const InboxView: FC = () => {
    const listId = useSelector(selectCurrentList)
    const list = useSelector(selectTaskLists)[listId]

    const dispatch = useDispatch()

    useEffect(() => {
        if (!list.initialized) {
            dispatch(setTasks(listId))
        }
    }, [dispatch, listId]) // TODO: cleanup the dependency list here and below

    const onAddNewTask = useCallback(async (e) => {
        const task = dateFromRelativeString({ name: e.target.value.trim() })
        dispatch(setCurrentTaskListToInbox())
        dispatch(createTask(task))
    }, [dispatch, setCurrentTaskListToInbox, createTask])

    const updateTaskPositionIndex = useCallback((result) => {
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination)) {
            dispatch(updateTaskIndex({
                sourceListType: source.droppableId,
                sourceIndex: source.index,
                destinationListType: destination.droppableId,
                destinationIndex: destination.index
            }))
        }
    }, [dispatch, updateTaskIndex])

    return (
        <>
            <AddNewTask onAddNewTask={onAddNewTask}/>
            <TasksSubtitle
                showNumberOfTasks={list.initialized}
                numberOfTasks={list.totalElements}
                currentList={listId}
                onToggleOpenClosedTasks={() => dispatch(toggleCurrentTaskList())}
            />
            {list.initialized ? <DragDropContext onDragEnd={updateTaskPositionIndex}>
                {list.content.length === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                    <img src="/images/no-tasks-eng.png" width="400px" height="400px" className="d-inline-block align-center" alt="No Tasks!"/>
                </div>}
                <InfiniteScroll
                    dataLength={list.content.length}
                    next={() => dispatch(setTasks(listId))}
                    hasMore={list.content.length < list.totalElements}
                    loader={<h4>Loading...</h4>}
                >
                    <DroppableTaskListWithHeader
                        droppableId={listId}
                        isDraggable
                        tasks={list.content}
                        onSaveTask={(id, task) => dispatch(updateTask(id, task))}
                        onTaskClose={id => dispatch(closeOrUndoCloseTask(id))}
                    />
                </InfiniteScroll>
            </DragDropContext> : <SpinnerView/>}
        </>
    )
}

export default InboxView
