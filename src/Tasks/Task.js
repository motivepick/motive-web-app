import React, { Component } from 'react'
import { Button, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import moment from 'moment'
import FontAwesome from 'react-fontawesome'
import './Task.css'
import { API_URL } from '../const'
import { handleDueDateOf } from './parser'
import { translate } from 'react-i18next'

class Task extends Component {

    state = {
        name: this.props.value.name,
        description: this.props.value.description || '',
        dueDate: this.props.value.dueDate ? moment(this.props.value.dueDate, moment.ISO_8601) : null,
        opened: false
    }

    render() {
        const { value, onClose, t } = this.props
        const { dueDate } = this.state

        return (
            <Row className="task-wrapper">
                <Col>
                    <div className="task">
                        <div style={{ cursor: 'pointer', display: 'flex' }} className="task-name">
                            <div style={{ flexGrow: '0', flexBasis: '0' }}>
                                <Button color="link" onClick={() => onClose(value)}>
                                    <FontAwesome name='check' style={{ color: '#000' }}/>
                                </Button>
                            </div>
                            <div onClick={this.handleTaskClick} className="task-name"
                                 style={{ flexGrow: '1', flexBasis: '0', paddingTop: '.40rem' }}>
                                {this.state.name}
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
                                        <Input type="text" value={this.state.name} onChange={this.handleNameChange} onBlur={this.saveName}
                                               onKeyPress={target => target.charCode === 13 && this.saveName()}/>
                                    </FormGroup>
                                    <FormGroup style={{ marginBottom: '0' }}>
                                        <Input type="textarea" value={this.state.description}
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

    handleTaskClick = () => {
        const { opened } = this.state
        this.setState({ opened: !opened })
    }

    handleNameChange = ({ target }) => {
        this.setState({ name: target.value })
    }

    handleDescriptionChange = ({ target }) => {
        this.setState({ description: target.value })
    }

    saveName = () => {
        const { value } = this.props
        const task = handleDueDateOf({ name: this.state.name.trim() })
        this.setState({ name: task.name, dueDate: task.dueDate || this.state.dueDate })
        Task.updateTask(value.id, { ...task })
    }

    saveDescription = () => {
        const { value } = this.props
        this.setState({ description: this.state.description.trim() })
        Task.updateTask(value.id, { description: this.state.description })
    }

    static updateTask(id, newTask) {
        fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
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
