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
        <div className="text-secondary" style={{ display: 'flex', gap: '16px', fontSize: '.875em' }}>
            {dueDate && <DueDate dimmedStyle={closed} value={dueDate}/>}
            {description && <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <FontAwesomeIcon icon={faNoteSticky}/> {description}
            </span>}
        </div>
    )
}

export default TaskStatusBar
