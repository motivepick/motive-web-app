import React from 'react'
import { Col, Row } from 'reactstrap'
import { translate } from 'react-i18next'

const SpinnerView = ({ t }) =>
    <div>
        <Row style={{ marginTop: '150px', marginBottom: '10px' }}>
            <Col className="text-center">
                <div className="spinner-grow text-secondary" role="status">
                    <span className="sr-only">{t('loading')}</span>
                </div>
            </Col>
        </Row>
    </div>

export default translate()(SpinnerView)
