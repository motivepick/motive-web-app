import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import moment from 'moment'
import './Task.css'
import { handleDueDateOf } from '../utils/taskUtils'
import { translate } from 'react-i18next'

class Task extends Component {

    static propTypes = {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        dueDate: PropTypes.string,
        onTaskUpdate: PropTypes.func.isRequired,
        saveTask: PropTypes.func.isRequired
    }

    state = { opened: false }

    render() {
        const { t } = this.props
        const dueDate = this.props.dueDate ? moment(this.props.dueDate, moment.ISO_8601) : null
        return (
            <Row className="task-wrapper">
                <Col>
                    <div className="task">
                        <div style={{ cursor: 'pointer', display: 'flex' }} className="task-name">
                            <div style={{ flexGrow: '0', flexBasis: '0' }}>
                                <Button color="link" onClick={() => this.handleTaskClose()}>
                                    <div className={'circle incompleteCircle'}/>
                                </Button>
                            </div>
                            <div onClick={this.handleTaskClick} className="task-name"
                                 style={{ flexGrow: '1', flexBasis: '0', paddingTop: '.40rem' }}>
                                {this.props.name}
                            </div>
                            {dueDate &&
                            <div onClick={this.handleTaskClick} className={`task-name ${Task.classOf(dueDate)}`}
                                 style={{ flexGrow: '0', flexBasis: '1', paddingTop: '.32rem' }}>
                                <small>{Task.format(dueDate)}</small>
                            </div>}
                        </div>
                        {this.state.opened && <Row>
                            <Col>
                                <Form onSubmit={e => e.preventDefault()} style={{ padding: '.65rem .6rem' }}>
                                    <FormGroup>
                                        <Input type="text" value={this.props.name} onChange={this.handleNameChange} onBlur={this.saveName}
                                               onKeyPress={target => target.charCode === 13 && this.saveName()}/>
                                    </FormGroup>
                                    <FormGroup style={{ marginBottom: '0' }}>
                                        <Input type="textarea" value={this.props.description}
                                               onChange={this.handleDescriptionChange}
                                               onBlur={this.saveDescription}
                                               placeholder={t('task.description')}/>
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>}
                    </div>
                </Col>
            </Row>
        )
    }

    handleTaskClose = async() => {
        const taskId = this.props.id

        await this.props.onTaskUpdate(taskId, 'closed', true)
        this.props.saveTask(taskId)
    }

    handleTaskClick = () => {
        const { opened } = this.state
        this.setState({ opened: !opened })
    }

    handleNameChange = ({ target }) => {
        const taskId = this.props.id
        this.props.onTaskUpdate(taskId, 'name', target.value)
    }

    handleDescriptionChange = ({ target }) => {
        const taskId = this.props.id
        this.props.onTaskUpdate(taskId, 'description', target.value)
    }

    saveName = async() => {
        const name = this.props.name
        const task = handleDueDateOf({ name: name ? name.trim() : '' })

        const taskId = this.props.id
        await this.props.onTaskUpdate(taskId, 'name', task.name.trim())
        await this.props.onTaskUpdate(taskId, 'dueDate', task.dueDate || this.props.dueDate)
        this.props.saveTask(taskId)
    }

    saveDescription = async() => {
        const taskId = this.props.id
        const description = this.props.description
        await this.props.onTaskUpdate(taskId, 'description', description ? description.trim() : '')
        this.props.saveTask(taskId)
    }

    static classOf(dueDate) {
        if (dueDate) {
            const now = new Date()
            if (dueDate.isBefore(now, 'day')) {
                return 'text-danger'
            } else if (dueDate.isSame(now, 'day')) {
                return 'text-primary'
            } else {
                return ''
            }
        } else {
            return ''
        }
    }

    static format(dueDate) {
        return dueDate.local().calendar()
    }
}

export default translate('translations')(Task)
