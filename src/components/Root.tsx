import React, { FC, useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Container } from 'reactstrap'
import { setCurrentTaskListToInbox } from '../redux/actions/taskActions'
import { useDispatch } from 'react-redux'
import Navigation from './Navigation/Navigation'
import Footer from './common/Footer'
import { useFetchUserQuery } from '../redux/userApi'
import Spinner from './common/Spinner'
import ProtectedRoute from './ProtectedRoute'
import { setTheme } from '../utils/theme'

const Root: FC = () => {
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setTheme(mediaQuery.matches ? 'dark' : 'light')
        mediaQuery.addEventListener('change', ({ matches }) => setTheme(matches ? 'dark' : 'light'))
    }, [])

    const handleAllTasksClick = useCallback(() => {
        const { pathname } = location
        if (pathname === '/') {
            // @ts-ignore
            dispatch(setCurrentTaskListToInbox())
        }
    }, [dispatch])

    const { data: user, isLoading } = useFetchUserQuery()

    return (
        <Container>
            {isLoading ? <Spinner/> : <ProtectedRoute isAllowed={!!user} redirectPath="/login">
                <Navigation isTemporaryUserLoggedIn={user?.temporary} onAllTasksClick={handleAllTasksClick}/>
                <Outlet/>
                <Footer/>
            </ProtectedRoute>}
        </Container>
    )
}

export default Root
