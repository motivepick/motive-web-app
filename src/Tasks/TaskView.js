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
    updateUserTasksAction
} from '../actions/tasksActions'
import { closeTask, createTask, searchUserTasks, undoCloseTask, updateTask } from '../services/taskService'

class TaskView extends PureComponent {

    componentDidMount() {
        const { updateUserTasks } = this.props
        updateUserTasks()
    }

    render() {
        const { tasks, initialized, closed, updateTask, toggleOpenClosedTasks, t } = this.props
        console.log('CLOSED', closed)
        return (
            <Fragment>
                <Navigation history={this.props.history}/>
                <div>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            <Input type="text" placeholder={t('new.task')}
                                   onKeyPress={this.onAddNewTask} autoFocus={isBrowser}
                                   innerRef={input => this.taskNameInput = input}/>
                        </Col>
                    </Row>
                    {initialized ? <Fragment>
                        <TasksSubtitle numberOfTasks={tasks.length} closed={closed} onToggleOpenClosedTasks={toggleOpenClosedTasks}/>
                        <div>
                            {tasks.map(task =>
                                <Task key={task.id} id={task.id} name={task.name} description={task.description}
                                      dueDate={task.dueDate} onTaskClose={this.onTaskClose} saveTask={updateTask}/>
                            )}
                        </div>
                    </Fragment> : <SpinnerView/>}
                </div>
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

    onTaskClose = (id) => {
        const { closeOrUndoCloseTask } = this.props
        closeOrUndoCloseTask(id, true)
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

    updateUserTasks: () => async (dispatch) => {
        dispatch(updateUserTasksAction(await searchUserTasks()))
    },

    createTask: task => async (dispatch) => {
        dispatch(createTaskAction(await createTask(task)))
    },

    updateTask: (id: number, task) => async (dispatch) => {
        dispatch(updateTaskAction(await updateTask(id, task)))
    },

    closeOrUndoCloseTask: (id: number, newStateOfTaskIsClosed: boolean) => async (dispatch) => {
        if (newStateOfTaskIsClosed) {
            dispatch(closeTaskAction(await closeTask(id)))
        } else {
            dispatch(undoCloseTaskAction(await undoCloseTask(id)))
        }
    },

    toggleOpenClosedTasks: (closed: boolean) => (dispatch) => {
        dispatch(toggleOpenClosedTasksAction(closed))
    },

    showError: () => () => {
    }
}, dispatch)

const mapStateToProps = state => ({
    tasks: state.tasks.closed ? state.tasks.tasks.filter(t => t.closed) : state.tasks.tasks.filter(t => !t.closed),
    initialized: state.tasks.initialized,
    closed: state.tasks.closed
})

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(TaskView))
