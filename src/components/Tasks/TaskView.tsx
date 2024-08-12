// @ts-nocheck
import React, { PureComponent, useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import PageLayout from '../common/PageLayout'
import DroppableTaskListWithHeader from '../Schedule/DroppableTaskListWithHeader'
import AddNewTask from './AddNewTask'
import { withTranslation } from 'react-i18next'
import { dateFromRelativeString } from '../../utils/date-from-relative-string'
import SpinnerView from '../common/Spinner'
import TasksSubtitle from '../common/TasksSubtitle'
import { bindActionCreators } from 'redux'
import InfiniteScroll from 'react-infinite-scroll-component';
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
import Scrollable from './Scrollable'
import { create } from 'node:domain'

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

    const [inbox, setInbox] = useState(false)
    const [closed, setClosed] = useState(false)

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

    // const handleScroll = useCallback(() => {
    //     const scrolling = currentList == TASK_LIST.INBOX ? inbox : closed
    //     const setScrolling = currentList == TASK_LIST.INBOX ? setInbox : setClosed
    //     if (!scrolling) {
    //         const list = props[currentList]
    //         if (list.content.length < list.totalElements) {
    //             setScrolling(true)
    //         }
    //     }
    // }, [currentList, setTasks, inbox, setInbox, closed, setClosed])
    //
    // useEffect(() => {
    //     const setScrolling = currentList == TASK_LIST.INBOX ? setInbox : setClosed
    //     try {
    //         setTasks(currentList)
    //     } finally {
    //         setScrolling(false)
    //     }
    // }, [inbox, closed, currentList])

    console.log('RENDERING FOR', currentList, 'CONTENT LENGTH', list.content.length)

    if (initialized) {
        return (
            <>
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
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
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
            </>
        )
    } else {
        return <SpinnerView/>
    }
}

class TaskView extends PureComponent {

    state = { [TASK_LIST.INBOX]: false, [TASK_LIST.CLOSED]: false }

    componentDidMount() {
        this.setUserIfEmpty()
        this.setTasksIfEmpty(TASK_LIST.INBOX)
        this.setTasksIfEmpty(TASK_LIST.CLOSED)
    }

    onAddNewTask = async (e) => {
        const task = dateFromRelativeString({ name: e.target.value.trim() })

        const { setCurrentTaskListToInbox, createTask } = this.props
        setCurrentTaskListToInbox()
        await createTask(task)
    }

    render() {
        const { currentList, initialized, closeOrUndoCloseTask, updateTask, toggleCurrentTaskList } = this.props
        const list = this.props[currentList]
        if (!initialized) return <SpinnerView/>

        return <>
            <AddNewTask onAddNewTask={this.onAddNewTask}/>
            <TasksSubtitle numberOfTasks={list.totalElements} currentList={currentList} onToggleOpenClosedTasks={toggleCurrentTaskList}/>
            <DragDropContext onDragEnd={this.updateTaskPositionIndex}>
                {list.totalElements === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                    <img src="/images/no-tasks-eng.png" width="400px" height="400px" className="d-inline-block align-center" alt="No Tasks!"/>
                </div>}
                <Scrollable onScroll={this.handleScroll}>
                    <DroppableTaskListWithHeader
                        droppableId={currentList}
                        isDraggable
                        tasks={list.content}
                        onSaveTask={updateTask}
                        onTaskClose={closeOrUndoCloseTask}
                    />
                </Scrollable>
            </DragDropContext>
        </>
    }

    handleScroll = () => {
        const { currentList, setTasks } = this.props
        const scrolling = this.state[currentList]
        if (!scrolling) {
            const list = this.props[currentList]
            if (list.content.length < list.totalElements) {
                this.setState({ [currentList]: true }, async () => {
                    try {
                        await setTasks(currentList)
                    } finally {
                        this.setState({ [currentList]: false })
                    }
                })
            }
        }
    }

    // TODO: move upper in the DOM to avoid the check
    setUserIfEmpty = () => {
        if (!this.props.user.accountId) {
            const { setUser } = this.props
            setUser()
        }
    }

    // TODO: move upper in the DOM to avoid the check
    setTasksIfEmpty = (list) => {
        const taskList = this.props[list]
        if (taskList.content.length === 0) {
            const { setTasks } = this.props
            setTasks(list)
        }
    }

    updateTaskPositionIndex = (result) => {
        const { updateTaskIndex } = this.props
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination)) {
            updateTaskIndex(source.droppableId, source.index, destination.droppableId, destination.index)
        }
    }

    // TODO: fix again after migration to functional component.
    handleAllTasksClick = () => {
        const { location, setCurrentTaskListToInbox } = this.props
        const { pathname } = location
        if (pathname === '/') {
            setCurrentTaskListToInbox()
        }
    }
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

const TaskViewWithLocation = (props) => {
    const location = useLocation()
    const { user } = props

    return (
        <PageLayout user={user}>
            <InboxView {...props} location={location}/>
        </PageLayout>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TaskViewWithLocation))
