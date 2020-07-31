import React, { PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import { Col, Row } from 'reactstrap'
import { TASK_LIST } from '../const'

class TasksSubtitle extends PureComponent {

    render() {
        const { numberOfTasks, currentList, onToggleOpenClosedTasks, t } = this.props
        return (
            <Row style={{ padding: '10px 4px', textTransform: 'uppercase', fontSize: '80%' }}>
                <Col xs={5} style={{ color: '#8E8E93' }}>{t('numberOfTasks', { count: numberOfTasks })}</Col>
                <Col xs={7} style={{ color: '#EC445A' }} className={'text-right'}>
                    {/* eslint-disable-next-line */}
                    <a onClick={onToggleOpenClosedTasks} style={{ cursor: 'pointer' }}>
                        {t(currentList === TASK_LIST.CLOSED ? 'showOpenTasks' : 'showClosedTasks')}
                    </a>
                </Col>
            </Row>
        )
    }
}

export default withTranslation()(TasksSubtitle)
