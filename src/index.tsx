import React, { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './index.css'
import './i18n'
import Routes from './components/routes'
import { store } from './redux/store'

const container = document.getElementById('root') as Element
const root = createRoot(container)

root.render(
    // @ts-ignore
    <Provider store={store}>
        <Suspense fallback={<div>Loading...</div>}>
            <Router>
                <Routes/>
            </Router>
        </Suspense>
    </Provider>
)
