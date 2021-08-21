import React, { MouseEventHandler } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Col, Row } from 'reactstrap'
import { TASK_LIST, TaskListTypeAsLiterals } from '../models'

interface TasksSubtitleProps extends WithTranslation {
    numberOfTasks: number;
    currentList: TaskListTypeAsLiterals;
    onToggleOpenClosedTasks: MouseEventHandler;
}

const TasksSubtitle: React.FC<TasksSubtitleProps> = props => {
    const { numberOfTasks, currentList, onToggleOpenClosedTasks, t } = props
    return (
        <Row style={{ padding: '10px 4px', textTransform: 'uppercase', fontSize: '80%' }}>
            <Col xs={5} style={{ color: '#8E8E93' }}>{t('numberOfTasks', { count: numberOfTasks })}</Col>
            <Col xs={7} style={{ color: '#EC445A' }} className={'text-right'}>
                <a onClick={onToggleOpenClosedTasks} style={{ cursor: 'pointer' }}>
                    {t(currentList === TASK_LIST.CLOSED ? 'showOpenTasks' : 'showClosedTasks')}
                </a>
            </Col>
        </Row>
    )
}

export default withTranslation()(TasksSubtitle)
