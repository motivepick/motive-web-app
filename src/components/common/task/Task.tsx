// @ts-nocheck
import moment from 'moment'
import React, { useState } from 'react'
import { Draggable, DraggableProps } from 'react-beautiful-dnd'

import './Task.css'
import TaskDetails from './TaskDetails'
import TaskHeader from './TaskHeader/TaskHeader'

interface TaskProps extends Partial<DraggableProps> {
    id: number;
    name: string;
    dueDate?: string;
    onTaskClose: (id: number) => void;
    closed: boolean;
}

const HTML_ANCHOR_TAG = 'a'

const Task: React.FC<TaskProps> = (props) => {
    const { isDraggable, id, index, name, description } = props
    const [areDetailsShown, setAreDetailsShown] = useState(false)
    const [isClosed, setIsClosed] = useState(props.closed)

    const handleTaskClose = async () => {
        const { id, onTaskClose } = props
        setIsClosed(!isClosed)
        onTaskClose(id)
    }

    const handleTaskClick = ({ target }: React.MouseEvent<HTMLElement>) => {
        if (target.tagName.toLowerCase() !== HTML_ANCHOR_TAG) {
            setAreDetailsShown(!areDetailsShown)
        }
    }

    const renderDraggable = ({ id, index }) => {
        return (
            <Draggable draggableId={id.toString()} index={index}>
                {(provided) => (
                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        {renderItem()}
                    </div>
                )}
            </Draggable>
        )
    }

    const renderItem = () => {
        const dueDate = props.dueDate ? moment(props.dueDate, moment.ISO_8601) : null
        return (
            <div className="task">
                <TaskHeader task={{ name, dueDate }} isClosed={isClosed} onClick={handleTaskClick}
                            onClose={handleTaskClose}/>
                {areDetailsShown && <TaskDetails task={{ id, name, description, dueDate: props.dueDate }} />}
            </div>
        )
    }

    if (isDraggable) return renderDraggable({ id, index })
    return renderItem()
}

export default Task
