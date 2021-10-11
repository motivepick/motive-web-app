import { CheckMark } from './check-mark'
import { Title } from './title'
import { DueDate } from './due-date'
import React from 'react'
import { ITaskNullable } from '../../../../models/appModel'

import './TaskHeader.css'

type TTaskHeader = {
    task: ITaskNullable;
    isClosed: boolean;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    onClose: () => void;
}

const TaskHeader: React.FC<TTaskHeader> = ({ task, isClosed, onClick, onClose }) => {
    return (
        <div className="task-header">
            <CheckMark toggled={isClosed} onToggle={onClose}/>
            <div className="task-body">
                <Title dimmedStyle={isClosed} onClick={onClick}>{task.name}</Title>
                <DueDate dimmedStyle={isClosed} onClick={onClick}>{task.dueDate}</DueDate>
            </div>
        </div>
    )
}

export default TaskHeader
