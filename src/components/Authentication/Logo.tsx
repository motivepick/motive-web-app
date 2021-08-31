import React from 'react'
import { Col, Row } from 'reactstrap'

import './styles.css'

const Logo: React.FC = () =>
    <Row className="logo">
        <Col className="text-center">
            <img src="/logo.png" alt="Motive Logo" width={'64px'} height={'64px'}/>
        </Col>
    </Row>

export default Logo
