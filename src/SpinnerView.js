import React, { PureComponent } from 'react'
import { Col, Row } from 'reactstrap'
import { translate } from 'react-i18next'

class SpinnerView extends PureComponent {

    render() {
        const { t } = this.props
        return (
            <div>
                <Row style={{ marginTop: '150px', marginBottom: '10px' }}>
                    <Col className="text-center">
                        <div className="spinner-grow text-secondary" role="status">
                            <span className="sr-only">{t('loading')}</span>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default translate('translations')(SpinnerView)
