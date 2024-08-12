// @ts-nocheck
import React, { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import PageLayout from '../common/PageLayout'
import DroppableTaskListWithHeader from '../Schedule/DroppableTaskListWithHeader'
import AddNewTask from './AddNewTask'
import { dateFromRelativeString } from '../../utils/date-from-relative-string'
import SpinnerView from '../common/Spinner'
import TasksSubtitle from '../common/TasksSubtitle'
import { bindActionCreators } from 'redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
    closeTaskAction,
    createTaskAction,
    setCurrentListAction,
    setTasksAction,
    undoCloseTaskAction,
    updateTaskAction,
    updateTaskPositionIndexAction
} from '../../redux/actions/taskActions'
import { closeTask, createTask, searchUserTasks, undoCloseTask, updateTask, updateTasksOrderAsync } from '../../services/taskService'
import { handleServerException } from '../../utils/exceptionHandler'
import { fetchUser } from '../../services/userService'
import { setUserAction } from '../../redux/actions/userActions'
import { delay, DELAY_MS } from '../../utils/delay'
import { DragDropContext } from '@hello-pangea/dnd'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import { DEFAULT_LIMIT } from '../../config'
import { selectCurrentList, selectInitialized, selectTaskList } from '../../redux/selectors/taskSelectors'
import { selectUser } from '../../redux/selectors/userSelectors'
import { TASK_LIST, TaskListTypeAsLiterals } from '../../models/appModel'

interface Props {
    currentList: TaskListTypeAsLiterals
}

const InboxView: React.FC<Props> = (props: Props) => {
    const {
        user,
        currentList,
        initialized,
        closeOrUndoCloseTask,
        updateTask,
        toggleCurrentTaskList,
        setUser,
        setTasks,
        setCurrentTaskListToInbox,
        createTask,
        updateTaskIndex
    } = props
    const list = props[currentList]

    const location = useLocation()

    useEffect(() => {
        if (!user.accountId) {
            setUser()
        }

        if (props[TASK_LIST.INBOX].content.length === 0) {
            setTasks(TASK_LIST.INBOX)
        }

        if (props[TASK_LIST.CLOSED].content.length === 0) {
            setTasks(TASK_LIST.CLOSED)
        }
    }, [])

    const onAddNewTask = useCallback(async (e) => {
        const task = dateFromRelativeString({ name: e.target.value.trim() })
        setCurrentTaskListToInbox()
        await createTask(task)
    }, [setCurrentTaskListToInbox, createTask]) // TODO: cleanup the dependency list here and below

    const updateTaskPositionIndex = useCallback((result) => {
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination)) {
            updateTaskIndex(source.droppableId, source.index, destination.droppableId, destination.index)
        }
    }, [updateTaskIndex])

    // TODO: fix again after migration to functional component.
    const handleAllTasksClick = useCallback(() => {
        const { pathname } = location
        if (pathname === '/') {
            setCurrentTaskListToInbox()
        }
    }, [])

    return (
        <PageLayout user={user}>
            {initialized ? <>
                <AddNewTask onAddNewTask={onAddNewTask}/>
                <TasksSubtitle numberOfTasks={list.totalElements} currentList={currentList} onToggleOpenClosedTasks={toggleCurrentTaskList}/>
                <DragDropContext onDragEnd={updateTaskPositionIndex}>
                    {list.totalElements === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                        <img src="/images/no-tasks-eng.png" width="400px" height="400px" className="d-inline-block align-center" alt="No Tasks!"/>
                    </div>}
                    <InfiniteScroll
                        dataLength={list.content.length}
                        next={() => setTasks(currentList)}
                        hasMore={list.content.length < list.totalElements}
                        loader={<h4>Loading...</h4>}
                    >
                        <DroppableTaskListWithHeader
                            droppableId={currentList}
                            isDraggable
                            tasks={list.content}
                            onSaveTask={updateTask}
                            onTaskClose={closeOrUndoCloseTask}
                        />
                    </InfiniteScroll>
                </DragDropContext>
            </> : <SpinnerView/>}
        </PageLayout>
    )
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

    setUser: () => async (dispatch) => {
        try {
            dispatch(setUserAction(await fetchUser()))
        } catch (e) {
            handleServerException(e)
        }
    },

    setTasks: (list) => async (dispatch, getState) => {
        const offset = selectTaskList(getState(), list).content.length
        console.log('setting tasks for list', list, 'with offset', offset)
        try {
            dispatch(setTasksAction(list, await searchUserTasks(list, offset, DEFAULT_LIMIT)))
        } catch (e) {
            handleServerException(e)
        }
    },

    updateTaskIndex: (sourceListType, sourceIndex, destinationListType, destinationIndex) => async (dispatch) => {
        updateTasksOrderAsync({ sourceListType, sourceIndex, destinationListType, destinationIndex })
        dispatch(updateTaskPositionIndexAction({ sourceListType, sourceIndex, destinationListType, destinationIndex }))
    },

    createTask: task => async (dispatch) => {
        try {
            dispatch(createTaskAction(await createTask(task)))
        } catch (e) {
            handleServerException(e)
        }
    },

    // id: number
    updateTask: (id, task) => async (dispatch) => {
        try {
            dispatch(updateTaskAction(await updateTask(id, task)))
        } catch (e) {
            handleServerException(e)
        }
    },

    // id: number
    closeOrUndoCloseTask: (id) => async (dispatch, getState) => {
        const currentList = selectCurrentList(getState())
        try {
            const service = currentList === TASK_LIST.INBOX ? closeTask : undoCloseTask
            const action = currentList === TASK_LIST.INBOX ? closeTaskAction : undoCloseTaskAction
            const values = await Promise.all([service(id), delay(DELAY_MS)])
            dispatch(action(values[0]))
        } catch (e) {
            handleServerException(e)
        }
    },

    setCurrentTaskListToInbox: () => dispatch => {
        dispatch(setCurrentListAction(TASK_LIST.INBOX))
    },

    toggleCurrentTaskList: () => (dispatch, getState) => {
        dispatch(setCurrentListAction(selectCurrentList(getState()) === TASK_LIST.INBOX ? TASK_LIST.CLOSED : TASK_LIST.INBOX))
    }
}, dispatch)

const mapStateToProps = state => ({
    user: selectUser(state),
    currentList: selectCurrentList(state),
    [TASK_LIST.INBOX]: selectTaskList(state, TASK_LIST.INBOX),
    [TASK_LIST.CLOSED]: selectTaskList(state, TASK_LIST.CLOSED),
    initialized: selectInitialized(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(InboxView)
