import React from 'react'
import { translate } from 'react-i18next'
import { Col, Row } from 'reactstrap'
import moment from 'moment'
import { format } from '../utils/dateFormat'

const ScheduleHeader = ({ value, date }) =>
    <Row style={{ padding: '10px 4px', textTransform: 'uppercase', fontSize: '80%' }}>
        <Col xs={12} style={{ color: '#8E8E93' }}>{value ? value : format(moment(date, moment.ISO_8601))}</Col>
    </Row>

export default translate()(ScheduleHeader)
