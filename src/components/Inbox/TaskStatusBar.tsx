import { faNoteSticky } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DateTimeMaybeValid } from 'luxon/src/datetime'
import React, { FC } from 'react'
import DueDate from '../common/task-header/due-date'

import './Task.css'

interface TaskItemProps {
    description?: string | null
    dueDate?: DateTimeMaybeValid | null
    closed: boolean
}

const TaskStatusBar: FC<TaskItemProps> = props => {
    const { description, dueDate, closed } = props
    return (
        <small className='big-gap text-secondary'>
            <DueDate dimmedStyle={closed} value={dueDate}/>
            <span>{description ? <FontAwesomeIcon icon={faNoteSticky}/> : null}</span>
        </small>
    )
}

export default TaskStatusBar
