import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col, Input, Row } from 'reactstrap'
import Task from './Task'
import Navigation from '../Navigation/Navigation'

import { translate } from 'react-i18next'
import { searchUserTasks, createTask, updateUserTasks, updateTask, showError } from '../actions/taskActions'
import { ordered, handleDueDateOf } from '../utils/taskUtils'

class TaskView extends Component {

    componentDidMount() {
        const { user, searchUserTasks, updateUserTasks, showError } = this.props
        const { accountId } = user

        searchUserTasks(accountId)
            .then((res) => ordered(updateUserTasks({ $push: res.payload.body })))
            .catch((err) => showError(err))
    }

    onAddNewTask(e) {
        const input = e.target
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const { user, updateUserTasks, createTask } = this.props
            const task = handleDueDateOf({ accountId: user.accountId, name: input.value.trim() })
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
        const { user, tasks, t } = this.props
        return (
            <div>
                <Navigation user={user}/>
                <div>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            <Input type="text" placeholder={t('new.task')}
                                   onKeyPress={this.onAddNewTask.bind(this)} autoFocus
                                   innerRef={input => this.taskNameInput = input}/>
                        </Col>
                    </Row>
                    <div style={{ marginTop: '10px' }}>
                        {tasks.filter(t => !t.closed).map(task =>
                            <Task key={task.id} id={task.id} name={task.name} description={task.description}
                                  dueDate={task.dueDate} onTaskUpdate={this.onTaskUpdate} saveTask={this.saveTask}/>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    tasks: state.tasks.tasks
})


const mapDispatchToProps = {
    searchUserTasks,
    updateUserTasks,
    createTask,
    updateTask,
    showError
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(TaskView))
