import React, { PureComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import { withTranslation } from 'react-i18next'

import './App.css'
import TaskView from './Tasks/TaskView'
import LoginView from './Authentication/LoginView'
import PrivacyView from './Privacy/PrivacyView'
import ScheduleView from './Schedule/ScheduleView'

class Routes extends PureComponent {

    render() {
        return (
            <Container>
                <Switch>
                    <Route exact={true} path="/" component={TaskView}/>
                    <Route exact={true} path="/schedule" component={ScheduleView}/>
                    <Route path="/login" component={LoginView}/>
                    <Route path="/privacy" component={PrivacyView}/>
                </Switch>
            </Container>
        )
    }
}

export default withTranslation()(Routes)
