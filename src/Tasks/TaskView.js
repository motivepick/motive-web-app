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
    setTasksAction,
    toggleOpenClosedTasksAction,
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
import { DEFAULT_PAGE_SIZE } from '../config'

class TaskView extends PureComponent {

    componentDidMount() {
        const { setUser, setTasks } = this.props
        setUser()
        setTasks()
    }

    render() {
        const { user, tasks, initialized, closed, setTasks, closeOrUndoCloseTask, updateTask, toggleOpenClosedTasks, t } = this.props
        return (
            <DragDropContext onDragEnd={this.updateTaskPositionIndex}>
                <Navigation history={this.props.history} user={user} onAllTaskClick={this.handleAllTaskClick} />
                <div>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            <Input type="text" placeholder={t('new.task')} onKeyPress={this.onAddNewTask} autoFocus={isBrowser}
                                innerRef={input => this.taskNameInput = input} />
                        </Col>
                    </Row>
                    {initialized ? <Fragment>
                        <TasksSubtitle numberOfTasks={tasks.content.length} closed={closed} onToggleOpenClosedTasks={toggleOpenClosedTasks} />
                        {tasks.length === 0 && <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                            <img src={notasks} width="400px" height="400px" className="d-inline-block align-center" alt="No Tasks!" />
                        </div>}
                        <div>
                            <Droppable droppableId="tasks">
                                {provided => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {tasks.content.map((task, index) =>
                                            <Task key={task.id} index={index} id={task.id} name={task.name} description={task.description}
                                                dueDate={task.dueDate} closed={task.closed} onTaskClose={closeOrUndoCloseTask} saveTask={updateTask} />
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        {!tasks.last && <Button onClick={() => setTasks()}>Load More</Button>}
                    </Fragment> : <SpinnerView/>}
                </div>
                <Footer />
            </DragDropContext>
        )
    }

    updateTaskPositionIndex = (result) => {
        const { updateTaskIndex } = this.props
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination)) {
            console.log('Moved: ', source.index, destination.index)
            updateTaskIndex(source.index, destination.index)
        }
    }

    onAddNewTask = async (e) => {
        const input = e.target
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const { createTask } = this.props
            const task = handleDueDateOf({ name: input.value.trim() })
            input.disabled = true
            try {
                this.props.toggleOpenClosedTasks(false)
                await createTask(task)
                input.value = ''
            } finally {
                input.disabled = false
                this.taskNameInput.focus()
            }
        }
    }

    handleAllTaskClick = () => {
        const { location, toggleOpenClosedTasks } = this.props
        const { pathname } = location
        if (pathname === '/') {
            toggleOpenClosedTasks(false)
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

    setTasks: () => async (dispatch, getState) => {
        const state = getState()
        const { number } = state.tasks.tasks
        try {
            dispatch(setTasksAction(await searchUserTasks(number + 1, DEFAULT_PAGE_SIZE)))
        } catch (e) {
            handleServerException(e)
        }
    },

    updateTaskIndex: (sourceIndex, destinationIndex) => async (dispatch) => {
        updateTasksOrderAsync({ sourceListType: 'INBOX', sourceIndex, destinationListType: 'INBOX', destinationIndex }) // TODO
        dispatch(updateTaskPositionIndexAction(sourceIndex, destinationIndex))
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

    closeOrUndoCloseTask: (id: number, newValueOfTaskIsClosed: boolean) => async (dispatch) => {
        try {
            const service = newValueOfTaskIsClosed ? closeTask : undoCloseTask
            const action = newValueOfTaskIsClosed ? closeTaskAction : undoCloseTaskAction
            const values = await Promise.all([service(id), delay(DELAY_MS)])
            dispatch(action(values[0]))
        } catch (e) {
            handleServerException(e)
        }
    },

    toggleOpenClosedTasks: (closed: boolean) => (dispatch) => {
        dispatch(toggleOpenClosedTasksAction(closed))
    }
}, dispatch)

const mapStateToProps = state => ({
    user: state.user.user,
    tasks: state.tasks.tasks,
    initialized: state.tasks.initialized,
    closed: state.tasks.closed
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TaskView))
