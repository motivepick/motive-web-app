import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { withCookies } from 'react-cookie'
import { Container } from 'reactstrap'
import { translate } from 'react-i18next'
import { COOKIE_DOMAIN, COOKIE_PATH } from './const'

import './App.css'
import TaskView from './Tasks/TaskView'
import LoginView from './Authentication/LoginView'
import ErrorBoundary from './ErrorBoundary'
import PrivacyView from './PrivacyView'

const LoginSuccess = ({ cookies }) => {
    const token = window.location.pathname.replace('/login-success/', '')
    const now = new Date()
    // TODO: temporary solution. Move cookie operations to back end and restrict access to them for JavaScript
    const expires = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate())
    cookies.set('SESSION', token, { domain: COOKIE_DOMAIN, path: COOKIE_PATH, expires })
    return <Redirect to="/"/>
}

class Routes extends React.Component {

    render() {
        return (
            <ErrorBoundary>
                <Container>
                    <Route exact={true} path="/" component={TaskView}/>
                    <Route path="/login" component={LoginView}/>
                    <Route path="/login-success" render={() => (<LoginSuccess cookies={this.props.cookies}/>)}/>
                    <Route path="/privacy" component={PrivacyView}/>
                </Container>
            </ErrorBoundary>
        )
    }
}

export default withCookies(translate('translations')(Routes))
