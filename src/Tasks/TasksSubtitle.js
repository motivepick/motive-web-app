import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { Col, Row } from 'reactstrap'

class TasksSubtitle extends PureComponent {

    state = { closed: false }

    componentWillReceiveProps(nextProps) {
        const { closed } = nextProps
        this.setState({ closed })
    }

    render() {
        const { numberOfTasks, t } = this.props
        const { closed } = this.state
        return (
            <Row style={{ padding: '10px 4px', textTransform: 'uppercase' }}>
                <Col xs={4} style={{ color: '#8E8E93' }}>{t('numberOfTasks', { count: numberOfTasks })}</Col>
                <Col xs={8} style={{ color: '#EC445A' }} className={'text-right'}>
                    <a onClick={this.toggleTasks} style={{ cursor: 'pointer' }}>{t(closed ? 'showOpenTasks' : 'showClosedTasks')}</a>
                </Col>
            </Row>
        )
    }

    toggleTasks = () => {
        const { onToggleOpenClosedTasks } = this.props
        const { closed } = this.state
        this.setState({ closed: !closed })
        onToggleOpenClosedTasks(!closed)
    }
}

export default translate('translations')(TasksSubtitle)
