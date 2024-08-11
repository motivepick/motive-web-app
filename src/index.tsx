import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
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

ReactDOM.render(
    <Provider store={store}>
        <Suspense fallback={<div>Loading...</div>}>
            <Router>
                <Routes/>
            </Router>
        </Suspense>
    </Provider>, document.getElementById('root')
)