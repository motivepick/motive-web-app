import React from 'react'
import { Col, Row } from 'reactstrap'

const ScheduleHeader: React.FC = ({ children }) =>
    <Row style={{ padding: '10px 4px', textTransform: 'uppercase', fontSize: '80%' }}>
        <Col xs={12} style={{ color: '#8E8E93' }}>{children}</Col>
    </Row>

export default ScheduleHeader
