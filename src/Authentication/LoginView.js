import React, { PureComponent } from 'react'
import { Button, Col, Row, i } from 'reactstrap'
import { translate } from 'react-i18next'
import logo from '../logo.png'
import { API_URL } from '../const'
import { Link } from 'react-router-dom'

class LoginView extends PureComponent {

    render() {
        const { t } = this.props
        return (
            <div>
                <main>
                    <Row style={{ marginTop: '40px', marginBottom: '10px' }}>
                        <Col className="text-center">
                            <img src={logo} alt="Motive Logo" width={'64px'} height={'64px'}/>
                        </Col>
                    </Row>
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
                    <Row style={{ marginTop: '30px', marginBottom: '10px' }}>
                        <Col className="text-center">
                            <Button color={'primary'} href={`${API_URL}/oauth2/authorization/vk`}
                                    style={{ margin: '0 5px 10px 0' }}><i className="fa fa-vk" style={{ marginRight: '1em' }}/>{t('login.vk')}</Button>
                            <Button color={'secondary'} href={`${API_URL}/oauth2/authorization/facebook`}
                                    style={{ margin: '0 0 10px 5px' }}><i className="fa fa-facebook-square" style={{ marginRight: '1em' }}/>{t('login.facebook')}</Button>
                        </Col>
                    </Row>
                </main>
                <footer className="footer">
                    <div className="container">
                        <span className="text-muted">
                             <a href="mailto:motivepick@yahoo.com">
                                 {t('contactUs')}
                             </a>
                        </span>

                        <span className="text-muted">  |  <Link to='/privacy'>{t('privacyPolicy')}</Link></span>
                    </div>
                </footer>
            </div>
        )
    }
}

export default translate('translations')(LoginView)
