import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'

import './App.css'
import TaskView from './Tasks/TaskView'
import LoginView from './Authentication/LoginView'
import PrivacyView from './Privacy/PrivacyView'
import ScheduleView from './Schedule/ScheduleView'

const App = () => (
    <Container>
        <Switch>
            <Route exact path="/" component={TaskView}/>
            <Route path="/schedule" component={ScheduleView}/>
            <Route path="/login" component={LoginView}/>
            <Route path="/privacy" component={PrivacyView}/>
        </Switch>
    </Container>
)


export default App
