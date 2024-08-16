import React, { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'reactstrap'
import { TASK_LIST, TaskListTypeAsLiterals } from '../../models/appModel'
import './TasksSubtitle.css'

interface Props {
    showNumberOfTasks?: boolean
    numberOfTasks: number;
    currentList: TaskListTypeAsLiterals;
    onToggleOpenClosedTasks: MouseEventHandler;
}

const TasksSubtitle: React.FC<Props> = props => {
    const { t } = useTranslation()
    const { showNumberOfTasks, numberOfTasks, currentList, onToggleOpenClosedTasks } = props
    return (
        <Row className="task-subtitle">
            <Col xs={5} style={{ color: '#8E8E93' }}>{showNumberOfTasks !== false && t('numberOfTasks', { count: numberOfTasks })}</Col>
            <Col xs={7} style={{ color: '#EC445A' }} className={'text-end'}>
                <a onClick={onToggleOpenClosedTasks} style={{ cursor: 'pointer' }}>
                    {t(currentList === TASK_LIST.CLOSED ? 'showOpenTasks' : 'showClosedTasks')}
                </a>
            </Col>
        </Row>
    )
}

export default TasksSubtitle
