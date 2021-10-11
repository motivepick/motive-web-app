// @ts-nocheck
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Draggable, DraggableProps } from 'react-beautiful-dnd'
import { WithTranslation } from 'react-i18next'
import { CheckMark } from '../common/task-item/task-header/check-mark'
import { DueDate } from '../common/task-item/task-header/due-date'
import { Title } from '../common/task-item/task-header/title'

import './Task.css'
import TaskDetails from './TaskDetails'

interface TaskProps extends WithTranslation, DraggableProps {
    id: number;
    name: string;
    dueDate?: string;
    onTaskClose: (id: number) => void;
    closed: boolean;
}

class Task extends PureComponent<TaskProps> {

    static propTypes = {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        dueDate: PropTypes.string
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
        const { id, name, description, saveTask } = this.props
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

                {this.state.detailsShown && <TaskDetails task={{ id, name, description, dueDate: this.props.dueDate }} saveTask={saveTask}/>}
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
        // @ts-ignore
        if (target.tagName.toLowerCase() !== 'a') {
            const { detailsShown } = this.state
            this.setState({ detailsShown: !detailsShown })
        }
    }
}

export default Task
