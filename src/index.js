import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { CookiesProvider } from 'react-cookie'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { I18nextProvider } from 'react-i18next'
import thunkMiddleware from 'redux-thunk'
import 'bootstrap/dist/css/bootstrap.min.css'
import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/zh-tw'
import 'font-awesome/css/font-awesome.min.css'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import rootReducer from './reducers'
import i18n from './i18n'
import Routes from './routes'

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
    <CookiesProvider>
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <Router history={history}>
                    <Routes/>
                </Router>
            </I18nextProvider>
        </Provider>
    </CookiesProvider>, document.getElementById('root'))
registerServiceWorker()
