import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'
import { translate } from 'react-i18next'

class SpinnerView extends Component {

    render() {
        const { t } = this.props
        return (
            <div>
                <Row style={{ marginTop: '150px', marginBottom: '10px' }}>
                    <Col className="text-center">
                        <small>{t('loading')}</small>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default translate('translations')(SpinnerView)
