import React from 'react'
import { Route } from 'react-router-dom'
import { Container } from 'reactstrap'
import { translate } from 'react-i18next'

import './App.css'
import TaskView from './Tasks/TaskView'
import LoginView from './Authentication/LoginView'
import ErrorBoundary from './ErrorBoundary'

const Routes = () =>
    <ErrorBoundary>
        <Container>
            <Route exact={true} path="/" component={TaskView}/>
            <Route path="/login" component={LoginView}/>
        </Container>
    </ErrorBoundary>

export default translate('translations')(Routes)
