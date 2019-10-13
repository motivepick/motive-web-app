import React, { PureComponent } from 'react'
import { Route } from 'react-router-dom'
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
                <Route path="/privacy" component={PrivacyView}/>
            </Container>
        )
    }
}

export default translate('translations')(Routes)
