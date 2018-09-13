import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { withCookies } from 'react-cookie'
import { Container } from 'reactstrap'
import { translate } from 'react-i18next'

import './App.css'
import TaskView from './Tasks/TaskView'
import LoginView from './Authentication/LoginView'
import ErrorBoundary from './ErrorBoundary'

const LoginSuccess = ({ cookies }) => {
    let token = window.location.pathname.replace('/login-success/', '')
    cookies.set('SESSION', token, { path: '/' })
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
                </Container>
            </ErrorBoundary>
        );
    }
}

export default withCookies(translate('translations')(Routes))
