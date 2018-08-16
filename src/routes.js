import React from 'react'
import { Route } from 'react-router-dom'
import { Container } from 'reactstrap'
import { translate } from 'react-i18next'

import './App.css'
import App from './App'
import LoginForm from './Authentication/LoginForm'
import LoginView from './Authentication/LoginView'
import ErrorBoundary from './ErrorBoundary'

class Routes extends React.Component {

    render() {
        return (
            <ErrorBoundary>
                <Container>
                    <Route exact={true} path="/" component={App}/>
                    <Route path="/login" component={LoginForm}/>
                    <Route path="/development" component={LoginView}/>
                </Container>
            </ErrorBoundary>
        )
    }
}

export default translate('translations')(Routes)