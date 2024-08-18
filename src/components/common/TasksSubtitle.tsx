import React, { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { TASK_LIST_ID, TaskListIdAsLiterals } from '../../models/appModel'
import './TasksSubtitle.css'

interface Props {
    showNumberOfTasks?: boolean
    numberOfTasks: number;
    taskListId: TaskListIdAsLiterals;
    onToggleOpenClosedTasks: MouseEventHandler;
}

const TasksSubtitle: React.FC<Props> = props => {
    const { t } = useTranslation()
    const { showNumberOfTasks, numberOfTasks, taskListId, onToggleOpenClosedTasks } = props
    return (
        <div className="row task-subtitle">
            <div className="col-5" style={{ color: '#8E8E93' }}>{showNumberOfTasks !== false && t('numberOfTasks', { count: numberOfTasks })}</div>
            <div className="col-7 text-end" style={{ color: '#EC445A' }}>
                <a onClick={onToggleOpenClosedTasks} style={{ cursor: 'pointer' }}>
                    {t(taskListId === TASK_LIST_ID.CLOSED ? 'showOpenTasks' : 'showClosedTasks')}
                </a>
            </div>
        </div>
    )
}

export default TasksSubtitle
