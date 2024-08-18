import React, { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { API_URL, GITHUB_AUTH_URL, VK_AUTH_URL } from '../../config'
import './LoginView.css'
import Icon from '../Icon'

interface LoginViewProps {
    disabled?: boolean
}

const LoginView: FC<LoginViewProps> = () => {
    const { t } = useTranslation()
    const [disabled, setDisabled] = useState(false)
    const handleLogin = useCallback(() => setDisabled(true), [])

    return (
        <div className="container-xl">
            <main>
                <div className="row" style={{ marginTop: '40px', marginBottom: '10px' }}>
                    <div className="col text-center">
                        <img src="/logo.png" alt="Milestone Logo"/>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '20px', marginBottom: '10px' }}>
                    <div className="col text-center">
                        <h1>{t('welcome')}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col text-center">
                        <small>{t('description')}</small>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '30px', marginBottom: '10px' }}>
                    <div className="col text-center">
                        <a
                            aria-disabled={disabled}
                            onClick={handleLogin}
                            role="button"
                            className={`btn btn-secondary${disabled ? ' disabled' : ''}`}
                            href={GITHUB_AUTH_URL}
                            style={{ margin: '0 5px 10px 0' }}
                        >
                            <Icon icon="fa-brands fa-github" style={{ marginRight: '0.5em' }}/>
                            {t('login.github')}
                        </a>
                        <a
                            aria-disabled={disabled}
                            onClick={handleLogin}
                            role="button"
                            className={`btn btn-primary${disabled ? ' disabled' : ''}`}
                            href={VK_AUTH_URL}
                            style={{ margin: '0 0 10px 5px' }}
                        >
                            <Icon icon="fa-brands fa-vk" style={{ marginRight: '0.5em' }}/>
                            {t('login.vk')}
                        </a>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <div className="col text-center">
                        <a
                            aria-disabled={disabled}
                            onClick={handleLogin}
                            className={`btn btn-link${disabled ? ' disabled' : ''}`}
                            href={`${API_URL}/temporary/login`}
                            style={{ margin: '0 5px 10px 0' }}
                        >
                            {t('tryWithoutLogin')}
                        </a>
                    </div>
                </div>
            </main>
            <div className="footer">
            <span className="text-muted">
                 <a href="mailto:milestone@yahoo.com">
                     {t('contactUs')}
                 </a>
            </span>
                <span className="text-muted"> | <Link to="/privacy">{t('privacyPolicy')}</Link></span>
            </div>
        </div>
    )
}

export default LoginView
