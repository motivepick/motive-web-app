import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { Col, Input, Row } from 'reactstrap'
import Task from './Task'
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

class TaskView extends PureComponent {

    componentDidMount() {
        const { setUser, setTasks } = this.props
        setUser()
        setTasks()
    }

    render() {
        const { user, tasks, initialized, closed, closeOrUndoCloseTask, updateTask, toggleOpenClosedTasks, t } = this.props
        return (
            <DragDropContext onDragEnd={this.updateTaskPositionIndex}>
                <Navigation history={this.props.history} user={user} onAllTaskClick={this.handleAllTaskClick}/>
                <div>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            <Input type="text" placeholder={t('new.task')} onKeyPress={this.onAddNewTask} autoFocus={isBrowser}
                                innerRef={input => this.taskNameInput = input}/>
                        </Col>
                    </Row>
                    {initialized ? <Fragment>
                        <TasksSubtitle numberOfTasks={tasks.length} closed={closed} onToggleOpenClosedTasks={toggleOpenClosedTasks}/>
                        <div>
                            <Droppable droppableId="tasks">
                                {provided => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {tasks.map((task, index) =>
                                            <Task key={task.id} index={index} id={task.id} name={task.name} description={task.description}
                                                dueDate={task.dueDate} closed={task.closed} onTaskClose={closeOrUndoCloseTask} saveTask={updateTask}/>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </Fragment> : <SpinnerView/>}
                </div>
                <Footer/>
            </DragDropContext>
        )
    }

    updateTaskPositionIndex = (result) => {
        const { updateTaskIndex } = this.props
        const { source, destination } = result
        if (userReallyChangedOrder(source, destination)) {
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

    setTasks: () => async (dispatch) => {
        try {
            dispatch(setTasksAction(await searchUserTasks()))
        } catch (e) {
            handleServerException(e)
        }
    },

    updateTaskIndex: (sourceIndex, destinationIndex) => async (dispatch, getState) => {
        const state = getState()
        const tasks = state.tasks.closed ? state.tasks.tasks.filter(t => t.closed) : state.tasks.tasks.filter(t => !t.closed)
        const sourceId = tasks[sourceIndex].id
        const destinationId = tasks[destinationIndex].id
        updateTasksOrderAsync({ sourceId, destinationId })
        dispatch(updateTaskPositionIndexAction(sourceId, destinationId))
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
    tasks: state.tasks.closed ? state.tasks.tasks.filter(t => t.closed) : state.tasks.tasks.filter(t => !t.closed),
    initialized: state.tasks.initialized,
    closed: state.tasks.closed
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TaskView))
