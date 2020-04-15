import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { Button, Col, Input, Row } from 'reactstrap'
import Task from './Task'
import notasks from '../images/no-tasks-eng.png'
import Navigation from '../Navigation/Navigation'
import { translate } from 'react-i18next'
import { handleDueDateOf } from '../utils/taskUtils'
import SpinnerView from '../SpinnerView'
import { isBrowser } from 'react-device-detect'
import TasksSubtitle from '../component/TasksSubtitle'
import { bindActionCreators } from 'redux'
import {
    closeTaskAction,
    createTaskAction,
    setCurrentListAction,
    setTasksAction,
    undoCloseTaskAction,
    updateTaskAction,
    updateTaskPositionIndexAction
} from '../actions/taskActions'
import { closeTask, createTask, searchUserTasks, undoCloseTask, updateTask, updateTasksOrderAsync } from '../services/taskService'
import { handleServerException } from '../utils/exceptionHandler'
import { fetchUser } from '../services/userService'
import { setUserAction } from '../actions/userActions'
import Footer from '../component/Footer'
import { delay, DELAY_MS } from '../utils/delay'
import { history } from '../index'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { userReallyChangedOrder } from '../utils/dragAndDropUtils'
import { DEFAULT_LIMIT, TASK_LIST } from '../const'
import { selectCurrentList, selectInitialized, selectTaskList } from '../selectors/taskSelectors'
import { selectUser } from '../selectors/userSelectors'
import InfiniteScroll from 'react-infinite-scroller'

class TaskView extends PureComponent {

    componentDidMount() {
        this.setUserIfEmpty()
        this.setTasksIfEmpty(TASK_LIST.INBOX)
        this.setTasksIfEmpty(TASK_LIST.CLOSED)
    }

    render() {
        const { user, currentList, initialized, setTasks, closeOrUndoCloseTask, updateTask, toggleCurrentTaskList, t } = this.props
        const list = this.props[currentList]
        return (
            <DragDropContext onDragEnd={this.updateTaskPositionIndex}>
                <Navigation history={this.props.history} user={user} onAllTasksClick={this.handleAllTasksClick}/>
                <div>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            <Input type="text" placeholder={t('new.task')} onKeyPress={this.onAddNewTask} autoFocus={isBrowser}
                                innerRef={input => this.taskNameInput = input}/>
                        </Col>
                    </Row>
                    {initialized ? <Fragment>
                        <TasksSubtitle numberOfTasks={list.totalElements} currentList={currentList} onToggleOpenClosedTasks={toggleCurrentTaskList}/>
                        {list.length === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                            <img src={notasks} width="400px" height="400px" className="d-inline-block align-center" alt="No Tasks!"/>
                        </div>}
                        <div>
                            <Droppable droppableId={currentList}>
                                {provided => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        <InfiniteScroll loadMore={this.loadMoreTasks} hasMore={list.content.length < list.totalElements}
                                            loader={<div className="loader" key={0}>Loading ...</div>}>
                                            {list.content.map((task, index) =>
                                                <Task key={task.id} index={index} id={task.id} name={task.name} description={task.description}
                                                    dueDate={task.dueDate} closed={currentList === TASK_LIST.CLOSED} onTaskClose={closeOrUndoCloseTask}
                                                    saveTask={updateTask}/>
                                            )}
                                        </InfiniteScroll>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        {list.content.length < list.totalElements && <Button onClick={() => setTasks(currentList)}>Load More</Button>}
                    </Fragment> : <SpinnerView/>}
                </div>
                <Footer/>
            </DragDropContext>
        )
    }

    // TODO: move upper in the DOM to avoid the check
    setUserIfEmpty = () => {
        if (!this.props.user.accountId) {
            const { setUser } = this.props
            setUser()
        }
    }

    loadMoreTasks = () => {
        const { currentList, setTasks } = this.props
        setTasks(currentList)
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

    onAddNewTask = async (e) => {
        const input = e.target
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const { setCurrentTaskListToInbox, createTask } = this.props
            const task = handleDueDateOf({ name: input.value.trim() })
            input.disabled = true
            try {
                setCurrentTaskListToInbox()
                await createTask(task)
                input.value = ''
            } finally {
                input.disabled = false
                this.taskNameInput.focus()
            }
        }
    }

    handleAllTasksClick = () => {
        const { location, setCurrentTaskListToInbox } = this.props
        const { pathname } = location
        if (pathname === '/') {
            setCurrentTaskListToInbox()
        } else {
            history.push('/')
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
        try {
            dispatch(setTasksAction(list, await searchUserTasks(list, offset, DEFAULT_LIMIT)))
        } catch (e) {
            handleServerException(e)
        }
    },

    updateTaskIndex: (sourceListType, sourceIndex, destinationListType, destinationIndex) => async (dispatch) => {
        updateTasksOrderAsync({ sourceListType, sourceIndex, destinationListType, destinationIndex })
        dispatch(updateTaskPositionIndexAction(sourceListType, sourceIndex, destinationListType, destinationIndex))
    },

    createTask: task => async (dispatch) => {
        try {
            dispatch(createTaskAction(await createTask(task)))
        } catch (e) {
            handleServerException(e)
        }
    },

    updateTask: (id: number, task) => async (dispatch) => {
        try {
            dispatch(updateTaskAction(await updateTask(id, task)))
        } catch (e) {
            handleServerException(e)
        }
    },

    closeOrUndoCloseTask: (id: number) => async (dispatch, getState) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TaskView))
