import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
// @ts-ignore
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import 'bootstrap/dist/css/bootstrap.min.css'
import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/zh-tw'
import 'font-awesome/css/font-awesome.min.css'
import './index.css'
import rootReducer from './redux/reducers'
import './i18n'
import Routes from './components/routes'

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

const setUpLocale = () => {
    moment.updateLocale('en', {
        calendar: {
            sameDay: '[today]',
            nextDay: '[tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[yesterday]',
            lastWeek: 'DD.MM.YYYY',
            sameElse: 'DD.MM.YYYY'
        }
    })

    moment.updateLocale('ru', {
        calendar: {
            sameDay: '[сегодня]',
            nextDay: '[завтра]',
            nextWeek: 'dddd',
            lastDay: '[вчера]',
            lastWeek: 'DD.MM.YYYY',
            sameElse: 'DD.MM.YYYY'
        }
    })

    moment.updateLocale('zh-tw', {
        calendar: {
            sameDay: '[今天]',
            nextDay: '[明天]',
            nextWeek: 'dddd',
            lastDay: '[昨天]',
            lastWeek: 'DD.MM.YYYY',
            sameElse: 'DD.MM.YYYY'
        }
    })

    moment.locale(window.navigator.language)
}

setUpLocale()

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