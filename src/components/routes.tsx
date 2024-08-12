import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Container } from 'reactstrap'
import { withTranslation } from 'react-i18next'

import './App.css'
import InboxView from './Inbox/InboxView'
import LoginView from './Authentication/LoginView'
import PrivacyView from './Privacy/PrivacyView'
import ScheduleView from './Schedule/ScheduleView'

const AppRoutes = () =>
    <Container>
        <Routes>
            <Route path="/" element={<InboxView />}/>
            <Route path="/schedule" element={<ScheduleView />}/>
            <Route path="/login" element={<LoginView />}/>
            <Route path="/privacy" element={<PrivacyView />}/>
            <Route path="*" element={<div>404</div>} />
        </Routes>
    </Container>

export default withTranslation()(AppRoutes)
