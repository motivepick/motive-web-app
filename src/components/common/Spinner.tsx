import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Col, Row } from 'reactstrap'

const Spinner: React.FC<WithTranslation> = ({ t }) =>
    <div>
        <Row style={{ marginTop: '150px', marginBottom: '10px' }}>
            <Col className="text-center">
                <div className="spinner-grow text-secondary" role="status">
                    <span className="sr-only">{t('loading')}</span>
                </div>
            </Col>
        </Row>
    </div>

export default withTranslation()(Spinner)
