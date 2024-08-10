import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
// @ts-ignore
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './index.css'
import rootReducer from './redux/reducers'
import './i18n'
import Routes from './components/routes'

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export const history = createBrowserHistory()

ReactDOM.render(
    <Provider store={store}>
        <Suspense fallback={<div>Loading...</div>}>
            <Router history={history}>
                <Routes/>
            </Router>
        </Suspense>
    </Provider>, document.getElementById('root')
)