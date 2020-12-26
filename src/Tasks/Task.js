import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup } from 'reactstrap'
import moment from 'moment'
import { handleDueDateOf } from '../utils/taskUtils'
import { withTranslation } from 'react-i18next'
import { Draggable } from 'react-beautiful-dnd'
import { TASK_DESCRIPTION_LIMIT, TASK_NAME_LIMIT } from '../const'

import './Task.css'

import { CustomInput } from './CustomInput'
import { CheckMark } from '../component/task-item/task-header/check-mark'
import { Title } from '../component/task-item/task-header/title'
import { DueDate } from '../component/task-item/task-header/due-date'

class Task extends PureComponent {

    static propTypes = {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        dueDate: PropTypes.string,
        saveTask: PropTypes.func.isRequired
    }

    state = { closed: this.props.closed, detailsShown: false }

    render = () => {
        const { isDraggable = false } = this.props
        if (isDraggable) return this.renderDraggable()
        return this.renderItem()
    }

    renderDraggable() {
        const { id, index } = this.props
        return (
            <Draggable draggableId={id.toString()} index={index}>
                {(provided) => (
                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        {this.renderItem()}
                    </div>
                )}
            </Draggable>
        )
    }

    renderItem() {
        const { name, description, t } = this.props
        const { closed } = this.state
        const dueDate = this.props.dueDate ? moment(this.props.dueDate, moment.ISO_8601) : null
        return (
            <div className="task">
                <div className="task-header">
                    <CheckMark toggled={closed} onToggle={this.handleTaskClose}/>
                    <div className="task-body">
                        <Title dimmedStyle={closed} onClick={this.handleTaskClick}>{name}</Title>
                        <DueDate dimmedStyle={closed} onClick={this.handleTaskClick}>{dueDate}</DueDate>
                    </div>
                </div>

                {this.state.detailsShown &&
                <Form className="task-form" onSubmit={e => e.preventDefault()}>
                    <FormGroup>
                        <CustomInput type="text" value={name} onSave={this.saveName} maxLength={TASK_NAME_LIMIT}/>
                    </FormGroup>
                    <FormGroup>
                        <CustomInput type="date" value={dueDate && dueDate.format("YYYY-MM-DD")} onSave={this.saveDate}/>
                    </FormGroup>
                    <FormGroup className="task-form-description">
                        <CustomInput type="textarea" placeholder={t('task.description')} value={description}
                            onSave={this.saveDescription} maxLength={TASK_DESCRIPTION_LIMIT}/>
                    </FormGroup>
                </Form>
                }
            </div>
        )
    }

    handleTaskClose = async () => {
        const { id, onTaskClose } = this.props
        const { closed } = this.state
        this.setState({ closed: !closed })
        onTaskClose(id)
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
        return task.name
    }

    saveDescription = (description) => {
        const task = { description }
        this.props.saveTask(this.props.id, task)
        return task.description
    }

    saveDate = (dueDate) => {
        const task = { dueDate: moment(dueDate, "YYYY-MM-DD").endOf('day') }
        this.props.saveTask(this.props.id, task)
        return task.dueDate
    }
}

export default withTranslation()(Task)
