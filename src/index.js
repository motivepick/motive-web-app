import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import stayMotivatedApp from './reducers'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { setUser } from './actions'
import { API_URL } from './const'
import 'bootstrap/dist/css/bootstrap.min.css'
import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/zh-tw'
import 'font-awesome/css/font-awesome.min.css'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

const store = createStore(stayMotivatedApp)

const fetchUser = () => {
    const userId = localStorage.getItem('id')
    if (userId) {
        fetch(`${API_URL}/users/${userId}`, {
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.status === 404) {
                store.dispatch(setUser(undefined))
            }
            return response.json()
        }).then(user => {
            store.dispatch(setUser(user))
        })
    } else {
        store.dispatch(setUser(undefined))
    }
}


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

fetchUser()
setUpLocale()

ReactDOM.render(<Provider store={store}><I18nextProvider i18n={i18n}><App/></I18nextProvider></Provider>, document.getElementById('root'))
registerServiceWorker()
