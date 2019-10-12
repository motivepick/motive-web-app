import React, { PureComponent } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { withCookies } from 'react-cookie'
import { Container } from 'reactstrap'
import { translate } from 'react-i18next'

import './App.css'
import TaskView from './Tasks/TaskView'
import LoginView from './Authentication/LoginView'
import PrivacyView from './PrivacyView'

class Routes extends PureComponent {

    render() {
        return (
            <Container>
                <Route exact={true} path="/" component={TaskView}/>
                <Route path="/login" component={LoginView}/>
                <Route path="/login-success" render={() => <Redirect to="/"/>}/>
                <Route path="/privacy" component={PrivacyView}/>
            </Container>
        )
    }
}

export default withCookies(translate('translations')(Routes))
