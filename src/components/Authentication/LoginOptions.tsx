import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, i, Row } from 'reactstrap'
import { API_URL, FACEBOOK_AUTH_URL, VK_AUTH_URL } from '../../config'

import './styles.css'

const LoginOptions: React.FC = () => {
    const [disabled, setDisabled] = useState(false)
    const disable = () => { setDisabled(true) }

    const { t } = useTranslation()
    return (
        <>
            <Row className="loginOptions">
                <Col className="text-center">
                    <Button
                        disabled={disabled}
                        onClick={disable}
                        color="primary"
                        href={VK_AUTH_URL}
                        style={{ margin: '0 5px 10px 0' }}>
                        <i className="fa fa-vk" style={{ marginRight: '1em' }}/>
                        {t('login.vk')}
                    </Button>
                    <Button
                        disabled={disabled}
                        onClick={disable}
                        color="secondary"
                        href={FACEBOOK_AUTH_URL}
                        style={{ margin: '0 0 10px 5px' }}>
                        <i className="fa fa-facebook-square" style={{ marginRight: '1em' }}/>
                        {t('login.facebook')}
                    </Button>
                </Col>
            </Row>
            <Row className="withoutLogin">
                <Col className="text-center">
                    <Button
                        disabled={disabled}
                        onClick={disable} color="link"
                        href={`${API_URL}/temporary/login`}
                        style={{ margin: '0 5px 10px 0' }}>
                        {t('tryWithoutLogin')}
                    </Button>
                </Col>
            </Row>
        </>
    )
}

export default LoginOptions
