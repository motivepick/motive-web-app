import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { Col, Input, Row } from 'reactstrap'
import Task from './Task'
import Navigation from '../Navigation/Navigation'
import { translate } from 'react-i18next'
import { createTask, searchUserTasks, showError, updateTask, updateUserTasks } from '../actions/taskActions'
import { handleDueDateOf } from '../utils/taskUtils'
import SpinnerView from '../SpinnerView'
import { isBrowser } from 'react-device-detect'
import TasksSubtitle from './TasksSubtitle'

class TaskView extends PureComponent {

    componentDidMount() {
        const { searchUserTasks, updateUserTasks, showError, history } = this.props

        searchUserTasks()
            .then((res) => updateUserTasks({ $push: res.payload.body }))
            .catch((err) => {
                if (err.status === 401) {
                    history.push('/login')
                } else {
                    showError(err)
                }
            })
    }

    onAddNewTask = (e) => {
        const input = e.target
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const { updateUserTasks, createTask } = this.props
            const task = handleDueDateOf({ name: input.value.trim() })
            input.disabled = true

            createTask(task)
                .then((res) => {
                    updateUserTasks({ $unshift: [res.payload.body] })
                    input.value = ''
                    input.disabled = false
                    this.taskNameInput.focus()
                })
                .catch((err) => {
                    showError(err)
                    input.disabled = false
                })
        }
    }

    onTaskUpdate = async(taskId, fieldName, fieldValue) => {
        const { updateUserTasks, tasks } = this.props
        const updateQuery = { [fieldName]: { $set: fieldValue } }
        const taskIndex = tasks.findIndex(t => t.id === taskId)

        await updateUserTasks({ [taskIndex]: updateQuery })
    }

    saveTask = (taskId) => {
        const { updateTask, showError } = this.props
        let task = this.props.tasks.find(t => t.id === taskId)
        updateTask(taskId, task)
            .catch((err) => showError(err))
    }

    render() {
        const { tasks, t, initialized } = this.props
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
                        <TasksSubtitle numberOfTasks={tasks.length} onToggleTasks={() => console.log('TODO')}/>
                        <div>
                            {tasks.map(task =>
                                <Task key={task.id} id={task.id} name={task.name} description={task.description}
                                      dueDate={task.dueDate} onTaskUpdate={this.onTaskUpdate} saveTask={this.saveTask}/>
                            )}
                        </div>
                    </Fragment> : <SpinnerView/>}
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    tasks: state.tasks.tasks,
    initialized: state.tasks.initialized
})

const mapDispatchToProps = {
    searchUserTasks,
    updateUserTasks,
    createTask,
    updateTask,
    showError
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(TaskView))
