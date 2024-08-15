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
import { selectCurrentList, selectInitialized, selectTaskList } from '../../redux/selectors/taskSelectors'
import { TASK_LIST } from '../../models/appModel'

const InboxView: FC = () => {
    const currentList = useSelector(selectCurrentList)
    const initialized = useSelector(selectInitialized)
    const inbox = useSelector(state => selectTaskList(state, TASK_LIST.INBOX))
    const closed = useSelector(state => selectTaskList(state, TASK_LIST.CLOSED))
    const list = currentList == TASK_LIST.INBOX ? inbox : closed

    const dispatch = useDispatch()

    useEffect(() => {
        if (inbox.content.length === 0) {
            dispatch(setTasks(TASK_LIST.INBOX))
        }

        if (closed.content.length === 0) {
            dispatch(setTasks(TASK_LIST.CLOSED))
        }
    }, [dispatch]) // TODO: cleanup the dependency list here and below

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
        initialized ? <>
            <AddNewTask onAddNewTask={onAddNewTask}/>
            <TasksSubtitle numberOfTasks={list.totalElements} currentList={currentList} onToggleOpenClosedTasks={() => dispatch(toggleCurrentTaskList())}/>
            <DragDropContext onDragEnd={updateTaskPositionIndex}>
                {list.totalElements === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                    <img src="/images/no-tasks-eng.png" width="400px" height="400px" className="d-inline-block align-center" alt="No Tasks!"/>
                </div>}
                <InfiniteScroll
                    dataLength={list.content.length}
                    next={() => dispatch(setTasks(currentList))}
                    hasMore={list.content.length < list.totalElements}
                    loader={<h4>Loading...</h4>}
                >
                    <DroppableTaskListWithHeader
                        droppableId={currentList}
                        isDraggable
                        tasks={list.content}
                        onSaveTask={(id, task) => dispatch(updateTask(id, task))}
                        onTaskClose={id => dispatch(closeOrUndoCloseTask(id))}
                    />
                </InfiniteScroll>
            </DragDropContext>
        </> : <SpinnerView/>
    )
}

export default InboxView
