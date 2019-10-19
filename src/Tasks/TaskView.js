import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { Col, Input, Row } from 'reactstrap'
import Task from './Task'
import Navigation from '../Navigation/Navigation'
import { translate } from 'react-i18next'
import { handleDueDateOf } from '../utils/taskUtils'
import SpinnerView from '../SpinnerView'
import { isBrowser } from 'react-device-detect'
import TasksSubtitle from './TasksSubtitle'
import { bindActionCreators } from 'redux'
import {
    closeTaskAction,
    createTaskAction,
    toggleOpenClosedTasksAction,
    undoCloseTaskAction,
    updateTaskAction,
    updateTasksAction
} from '../actions/taskActions'
import { closeTask, createTask, searchUserTasks, undoCloseTask, updateTask } from '../services/taskService'
import { handleServerException } from '../utils/exceptionHandler'
import { fetchUser } from '../services/userService'
import { updateUserAction } from '../actions/userActions'
import Footer from '../component/Footer'

class TaskView extends PureComponent {

    componentDidMount() {
        const { updateUser, updateTasks } = this.props
        updateUser()
        updateTasks()
    }

    render() {
        const { user, tasks, initialized, closed, updateTask, toggleOpenClosedTasks, t } = this.props
        return (
            <Fragment>
                <Navigation history={this.props.history} user={user}/>
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
                            {tasks.map(task =>
                                <Task key={task.id} id={task.id} name={task.name} description={task.description}
                                    dueDate={task.dueDate} closed={task.closed} onTaskClose={this.onTaskClose} saveTask={updateTask}/>
                            )}
                        </div>
                    </Fragment> : <SpinnerView/>}
                </div>
                <Footer/>
            </Fragment>
        )
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

    onTaskClose = (id, newValueOfTaskIsClosed) => {
        const { closeOrUndoCloseTask } = this.props
        closeOrUndoCloseTask(id, newValueOfTaskIsClosed)
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

    updateUser: () => async (dispatch) => {
        try {
            dispatch(updateUserAction(await fetchUser()))
        } catch (e) {
            handleServerException(e)
        }
    },

    updateTasks: () => async (dispatch) => {
        try {
            dispatch(updateTasksAction(await searchUserTasks()))
        } catch (e) {
            handleServerException(e)
        }
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
            if (newValueOfTaskIsClosed) {
                dispatch(closeTaskAction(await closeTask(id)))
            } else {
                dispatch(undoCloseTaskAction(await undoCloseTask(id)))
            }
        } catch (e) {
            handleServerException(e)
        }
    },

    toggleOpenClosedTasks: (closed: boolean) => (dispatch) => {
        try {
            dispatch(toggleOpenClosedTasksAction(closed))
        } catch (e) {
            handleServerException(e)
        }
    }
}, dispatch)

const mapStateToProps = state => ({
    user: state.user.user,
    tasks: state.tasks.closed ? state.tasks.tasks.filter(t => t.closed) : state.tasks.tasks.filter(t => !t.closed),
    initialized: state.tasks.initialized,
    closed: state.tasks.closed
})

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(TaskView))
