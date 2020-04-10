import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form, FormGroup, Row } from 'reactstrap'
import moment from 'moment'
import './Task.css'
import { handleDueDateOf } from '../utils/taskUtils'
import { translate } from 'react-i18next'
import { CustomInput } from './CustomInput'
import { format } from '../utils/dateFormat'
import { CheckMark } from '../component/CheckMark'
import WithLinks from '../component/WithLinks'

class ScheduleTask extends PureComponent {

    static propTypes = {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        dueDate: PropTypes.string,
        saveTask: PropTypes.func.isRequired
    }

    state = { closed: this.props.closed, detailsShown: false }

    render() {
        const { name, description, t } = this.props
        const { closed } = this.state
        const dueDate = this.props.dueDate ? moment(this.props.dueDate, moment.ISO_8601) : null
        return (
            <div className="row task-wrapper">
                <Col>
                    <div className="task">
                        <div className="short" style={{ display: 'flex', alignItems: 'center', height: '2.5em' }}>
                            <Button color="link" onClick={this.handleTaskClose}>
                                <CheckMark closed={closed}/>
                            </Button>
                            <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyItems: 'flex-start' }} className="task-name">
                                <div onClick={this.handleTaskClick} className={`task-name ${closed ? 'closed' : ''}`} style={{ paddingRight: 12 }}>
                                    {closed ? <del><WithLinks>{this.props.name}</WithLinks></del> : <WithLinks>{this.props.name}</WithLinks>}
                                </div>
                                {dueDate && <small onClick={this.handleTaskClick} className={ScheduleTask.classOf(dueDate, closed)}>{format(dueDate)}</small>}
                            </div>
                        </div>

                        {this.state.detailsShown && <Row className="detailed">
                            <Col>
                                <Form onSubmit={e => e.preventDefault()} style={{ padding: '.65rem .6rem' }}>
                                    <FormGroup>
                                        <CustomInput type="text" value={name} dueDate={dueDate} onSave={this.saveName}/>
                                    </FormGroup>
                                    <FormGroup style={{ marginBottom: '0' }}>
                                        <CustomInput type="textarea" placeholder={t('task.description')} value={description}
                                            onSave={this.saveDescription}/>
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>}
                    </div>
                </Col>
            </div>
        )
    }

    handleTaskClose = async () => {
        const { id, onTaskClose } = this.props
        const { closed } = this.state
        this.setState({ closed: !closed })
        onTaskClose(id, !closed)
    }

    handleTaskClick = ({ target }) => {
        if (target.tagName.toLowerCase() !== 'a') {
            const { detailsShown } = this.state
            this.setState({ detailsShown: !detailsShown })
        }
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

export default translate()(ScheduleTask)