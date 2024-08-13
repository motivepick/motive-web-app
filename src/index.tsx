import React, { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { createRoot } from 'react-dom/client'
import thunkMiddleware from 'redux-thunk'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './index.css'
import rootReducer from './redux/reducers'
import './i18n'
import Routes from './components/routes'

const container = document.getElementById('root') as Element
const root = createRoot(container)
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

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
