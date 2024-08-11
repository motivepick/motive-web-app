// @ts-nocheck
import React, { Fragment, PureComponent } from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Col, Input, Row } from 'reactstrap'
import Task from './Task'
import Navigation from '../Navigation/Navigation'
import { withTranslation } from 'react-i18next'
import { dateFromRelativeString } from '../../utils/date-from-relative-string'
import SpinnerView from '../common/Spinner'
import { isBrowser } from 'react-device-detect'
import TasksSubtitle from '../common/TasksSubtitle'
import { bindActionCreators } from 'redux'
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
import Footer from '../common/Footer'
import { delay, DELAY_MS } from '../../utils/delay'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { userReallyChangedOrder } from '../../utils/dragAndDropUtils'
import { DEFAULT_LIMIT, INFINITE_SCROLL_BOTTOM_OFFSET } from '../../config'
import { selectCurrentList, selectInitialized, selectTaskList } from '../../redux/selectors/taskSelectors'
import { selectUser } from '../../redux/selectors/userSelectors'
import { TASK_LIST } from '../../models/appModel'

class TaskView extends PureComponent {

    state = { [TASK_LIST.INBOX]: false, [TASK_LIST.CLOSED]: false }

    componentDidMount() {
        this.setUserIfEmpty()
        this.setTasksIfEmpty(TASK_LIST.INBOX)
        this.setTasksIfEmpty(TASK_LIST.CLOSED)
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    render() {
        const { user, currentList, initialized, closeOrUndoCloseTask, updateTask, toggleCurrentTaskList, t } = this.props
        const list = this.props[currentList]
        return (
            <DragDropContext onDragEnd={this.updateTaskPositionIndex}>
                <Navigation isTemporaryUserLoggedIn={user.temporary} onAllTasksClick={this.handleAllTasksClick}/>
                <div>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            <Input type="text" placeholder={t('new.task')} onKeyPress={this.onAddNewTask} autoFocus={isBrowser}
                                   innerRef={input => this.taskNameInput = input}/>
                        </Col>
                    </Row>
                    {initialized ? <Fragment>
                        <TasksSubtitle numberOfTasks={list.totalElements} currentList={currentList} onToggleOpenClosedTasks={toggleCurrentTaskList}/>
                        {list.totalElements === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                            <img src='/images/no-tasks-eng.png' width="400px" height="400px" className="d-inline-block align-center" alt="No Tasks!"/>
                        </div>}
                        <Droppable droppableId={currentList}>
                            {provided => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {list.content.map((task, index) =>
                                        <Task isDraggable={true} key={task.id} index={index} id={task.id} name={task.name} description={task.description}
                                              dueDate={task.dueDate} closed={currentList === TASK_LIST.CLOSED} onTaskClose={closeOrUndoCloseTask}
                                              saveTask={updateTask}/>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </Fragment> : <SpinnerView/>}
                </div>
                <Footer/>
            </DragDropContext>
        )
    }

    handleScroll = () => {
        const { currentList, setTasks } = this.props
        const scrolling = this.state[currentList]
        const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
        const body = document.body
        const html = document.documentElement
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        const windowBottom = windowHeight + window.pageYOffset
        if (!scrolling && windowBottom >= docHeight - INFINITE_SCROLL_BOTTOM_OFFSET) {
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

    onAddNewTask = async (e) => {
        const input = e.target
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const { setCurrentTaskListToInbox, createTask } = this.props
            const task = dateFromRelativeString({ name: input.value.trim() })
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

    return <TaskView {...props} location={location} />
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TaskViewWithLocation))
