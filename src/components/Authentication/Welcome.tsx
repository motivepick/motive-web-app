import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'reactstrap'

import './styles.css'

const Welcome: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <Row className="welcome">
                <Col className="text-center">
                    <h1>{t('welcome')}</h1>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <small>{t('description')}</small>
                </Col>
            </Row>
        </>
    )
}
export default Welcome
