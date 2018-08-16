import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise'
import { I18nextProvider } from 'react-i18next'
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

const enhancer = applyMiddleware(promise)
const store = createStore(rootReducer, enhancer)

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

ReactDOM.render(
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
            <BrowserRouter>
                <Routes/>
            </BrowserRouter>
        </I18nextProvider>
    </Provider>, document.getElementById('root'))
registerServiceWorker()
