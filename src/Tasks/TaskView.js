import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col, Input, Row } from 'reactstrap'
import Task from './Task'
import Navigation from '../Navigation/Navigation'

import { handleDueDateOf } from './parser'
import { translate } from 'react-i18next'
import { searchUserTasks, createTask, updateUserTasks, updateTask, showError } from '../actions/taskActions'
import { ordered } from '../utils/taskUtils'

class TaskView extends Component {

    componentDidMount() {
        const { user, searchUserTasks, updateUserTasks, showError } = this.props
        const { accountId } = user

        searchUserTasks(accountId)
            .then((res) => ordered(updateUserTasks(res.payload.body)))
            .catch((err) => showError(err))
    }

    onAddNewTask(e) {
        const input = e.target
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const { user, updateUserTasks, createTask, tasks } = this.props
            const task = handleDueDateOf({ accountId: user.accountId, name: input.value.trim() })
            input.disabled = true

            createTask(task)
                .then((res) => {
                    updateUserTasks([res.payload.body].concat(tasks))
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

    onCloseTask = (taskToClose) => {
        const { updateTask, updateUserTasks, showError, tasks } = this.props
        taskToClose.closed = true
        updateTask(taskToClose.id, taskToClose)
            .then(updateUserTasks(tasks.filter(t => t.id !== taskToClose.id)))
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
                        {tasks.map(task => <Task key={task.id} value={task} onClose={this.onCloseTask}/>)}
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
