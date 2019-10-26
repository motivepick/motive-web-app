import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form, FormGroup, Row } from 'reactstrap'
import moment from 'moment'
import './Task.css'
import { handleDueDateOf } from '../utils/taskUtils'
import { translate } from 'react-i18next'
import { CustomInput } from './CustomInput'
import { format } from '../utils/dateFormat'

class Task extends PureComponent {

    static propTypes = {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        dueDate: PropTypes.string,
        saveTask: PropTypes.func.isRequired
    }

    state = { opened: false }

    render() {
        const { name, description, closed, t } = this.props
        const dueDate = this.props.dueDate ? moment(this.props.dueDate, moment.ISO_8601) : null
        return (
            <Row className="task-wrapper">
                <Col>
                    <div className="task">
                        <div style={{ cursor: 'pointer', display: 'flex' }} className="task-name">
                            <div style={{ flexGrow: '0', flexBasis: '0' }}>
                                <Button color="link" onClick={this.handleTaskClose}>
                                    <div className={`circle ${closed ? 'complete-circle' : 'incomplete-circle'}`}/>
                                </Button>
                            </div>
                            <div onClick={this.handleTaskClick} className={`task-name ${closed ? 'closed' : ''}`}
                                style={{ flexGrow: '1', flexBasis: '0', paddingTop: '.40rem' }}>
                                {closed ? <del>{this.props.name}</del> : this.props.name}
                            </div>
                            {dueDate &&
                            <div onClick={this.handleTaskClick} className={`task-name ${Task.classOf(dueDate, closed)}`}
                                style={{ flexGrow: '0', flexBasis: '1', paddingTop: '.32rem' }}>
                                <small>{format(dueDate)}</small>
                            </div>}
                        </div>
                        {this.state.opened && <Row>
                            <Col>
                                <Form onSubmit={e => e.preventDefault()} style={{ padding: '.65rem .6rem' }}>
                                    <FormGroup>
                                        <CustomInput type="text" value={name} dueDate={dueDate} onSave={this.saveName}/>
                                    </FormGroup>
                                    <FormGroup style={{ marginBottom: '0' }}>
                                        <CustomInput type="textarea" placeholder={t('task.description')} value={description} onSave={this.saveDescription}/>
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>}
                    </div>
                </Col>
            </Row>
        )
    }

    handleTaskClose = async () => {
        const { id, closed, onTaskClose } = this.props
        onTaskClose(id, !closed)
    }

    handleTaskClick = () => {
        const { opened } = this.state
        this.setState({ opened: !opened })
    }

    saveName = (name) => {
        const task = handleDueDateOf({ name: name ? name.trim() : '' })
        this.props.saveTask(this.props.id, task)
    }

    saveDescription = (description) => {
        const task = { description }
        this.props.saveTask(this.props.id, task)
    }

    static classOf(dueDate, closed) {
        if (closed) {
            return 'closed'
        } else if (dueDate) {
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
}

export default translate('translations')(Task)
