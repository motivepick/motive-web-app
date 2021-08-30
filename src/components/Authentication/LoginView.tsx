import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button, Col, i, Row } from 'reactstrap'
import { API_URL, FACEBOOK_AUTH_URL, VK_AUTH_URL } from '../../config'

const Logo: React.FC = () =>
    <Row style={{ marginTop: '40px', marginBottom: '10px' }}>
        <Col className="text-center">
            <img src="/logo.png" alt="Motive Logo" width={'64px'} height={'64px'}/>
        </Col>
    </Row>

const Welcome: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <Row style={{ marginTop: '20px', marginBottom: '10px' }}>
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

const LoginOptions: React.FC = () => {
    const [disabled, setDisabled] = useState(false)
    const disable = () => { setDisabled(true) }

    const { t } = useTranslation()
    return (
        <>
            <Row style={{ marginTop: '30px', marginBottom: '10px' }}>
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
            <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
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

const Footer: React.FC = () => {
    const { t } = useTranslation()
    return (
        <div className="footer">
            <span className="text-muted">
                 <a href="mailto:motivepick@yahoo.com">
                     {t('contactUs')}
                 </a>
            </span>
            <span className="text-muted">  |  <Link to="/privacy">{t('privacyPolicy')}</Link></span>
        </div>
    )
}

const LoginView: React.FC = () =>
    <div>
        <main>
            <Logo/>
            <Welcome/>
            <LoginOptions/>
        </main>
        <Footer/>
    </div>

export default LoginView
