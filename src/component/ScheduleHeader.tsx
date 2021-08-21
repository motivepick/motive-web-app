import moment, { Moment } from 'moment'
import React, { FunctionComponent } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Col, Row } from 'reactstrap'

import { format } from '../utils/dateFormat'

interface ScheduleHeaderProps extends WithTranslation {
    value?: string;
    date?: Moment;
}

const ScheduleHeader: FunctionComponent<ScheduleHeaderProps> = ({ value, date }) =>
    <Row style={{ padding: '10px 4px', textTransform: 'uppercase', fontSize: '80%' }}>
        <Col xs={12} style={{ color: '#8E8E93' }}>{value ?? format(moment(date, moment.ISO_8601))}</Col>
    </Row>

export default withTranslation()(ScheduleHeader)
