import React, { FC } from 'react'
import { Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'

const Spinner: FC = () => {
    const { t } = useTranslation()
    return <div>
        <Row style={{ marginTop: '150px', marginBottom: '10px' }}>
            <Col className="text-center">
                <div className="spinner-grow text-secondary" role="status">
                    <span className="sr-only">{t('loading')}</span>
                </div>
            </Col>
        </Row>
    </div>
}

export default Spinner
