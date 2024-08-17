import React, { StrictMode, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './index.css'
import './i18n'
import { store } from './redux/store'
import Root from './components/Root'
import ScheduleView from './components/Schedule/ScheduleView'
import InboxView from './components/Inbox/InboxView'
import PrivacyView from './components/Privacy/PrivacyView'
import LoginView from './components/Authentication/LoginView'
import { setTheme } from './utils/theme'
import Fallback from './components/Fallback'

const container = document.getElementById('root') as Element
const root = createRoot(container)

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root/>,
        errorElement: <div>404</div>,
        children: [
            {
                path: '/',
                element: <InboxView/>
            },
            {
                path: '/schedule',
                element: <ScheduleView/>
            }
        ]
    },
    {
        path: '/login',
        element: <LoginView/>
    },
    {
        path: '/privacy',
        element: <PrivacyView/>
    }
])

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
setTheme(mediaQuery.matches ? 'dark' : 'light')
mediaQuery.addEventListener('change', ({ matches }) => setTheme(matches ? 'dark' : 'light'))

root.render(
    <StrictMode>
        <Provider store={store}>
            <Suspense fallback={<Fallback/>}>
                <RouterProvider router={router}/>
            </Suspense>
        </Provider>
    </StrictMode>
)
