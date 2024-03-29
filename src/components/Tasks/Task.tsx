// @ts-nocheck
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Draggable, DraggableProps } from 'react-beautiful-dnd'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Form, FormGroup } from 'reactstrap'
import { CheckMark } from '../common/task-item/task-header/check-mark'
import { DueDate } from '../common/task-item/task-header/due-date'
import { Title } from '../common/task-item/task-header/title'
import { TASK_DESCRIPTION_LIMIT, TASK_NAME_LIMIT } from '../../config'
import { ITaskNullable } from '../../models/appModel'
import { handleDueDateOf } from '../../utils/taskUtils'

import { CustomInput } from './CustomInput'

import './Task.css'

interface TaskProps extends WithTranslation, DraggableProps {
    id: number;
    name: string;
    description?: string;
    dueDate?: string;
    saveTask: (id: number, task: ITaskNullable) => void;
    onTaskClose: (id: number) => void;
    closed: boolean;
}

const DUE_DATE_FORMAT = 'YYYY-MM-DD'

const isTaskToggle = (target: any) => {
    const tagName = target.tagName.toLowerCase()
    const className = target.className
    return ['div', 'form', 'small', 'del'].includes(tagName) && !className.includes('task-check-mark-element')
}

class Task extends PureComponent<TaskProps> {

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
            <div className="task-container">
                <div className="task" onClick={this.handleTaskClick}>
                    <div className="task-header">
                        <CheckMark toggled={closed} onToggle={this.handleTaskClose}/>
                        <div className="task-body">
                            <Title dimmedStyle={closed}>{name}</Title>
                            <DueDate dimmedStyle={closed}>{dueDate}</DueDate>
                        </div>
                    </div>

                    {this.state.detailsShown &&
                    <Form className="task-form" onSubmit={e => e.preventDefault()}>
                        <FormGroup>
                            <CustomInput type="text" value={name} onSave={this.saveName} maxLength={TASK_NAME_LIMIT}/>
                        </FormGroup>
                        <FormGroup>
                            <CustomInput type="date" value={dueDate && dueDate.format(DUE_DATE_FORMAT)}
                                onSave={this.saveDate} maxLength={DUE_DATE_FORMAT.length}/>
                        </FormGroup>
                        <FormGroup className="task-form-description">
                            <CustomInput type="textarea" placeholder={t('task.description')} value={description}
                                onSave={this.saveDescription} maxLength={TASK_DESCRIPTION_LIMIT}/>
                        </FormGroup>
                    </Form>
                    }
                </div>
            </div>
        )
    }

    handleTaskClose = async () => {
        const { id, onTaskClose } = this.props
        const { closed } = this.state
        this.setState({ closed: !closed })
        onTaskClose(id)
    }

    handleTaskClick = ({ target }: React.MouseEvent<HTMLElement>) => {
        if (isTaskToggle(target)) {
            const { detailsShown } = this.state
            this.setState({ detailsShown: !detailsShown })
        }
    }

    saveName = (name: string) => {
        // @ts-ignore
        const task = handleDueDateOf({ name: name ? name.trim() : '' })
        this.props.saveTask(this.props.id, task)
        return task.name
    }

    saveDescription = (description: string) => {
        const task = { description }
        this.props.saveTask(this.props.id, task)
        return task.description
    }

    saveDate = (dueDate: string) => {
        const task = { dueDate: moment(dueDate, 'YYYY-MM-DD').endOf('day') }
        this.props.saveTask(this.props.id, task)
        return task.dueDate
    }
}

export default withTranslation()(Task)
