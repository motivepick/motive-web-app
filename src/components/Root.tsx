import React, { FC, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Container } from 'reactstrap'
import { setCurrentTaskListToInbox } from '../redux/actions/taskActions'
import { useDispatch } from 'react-redux'
import Navigation from './Navigation/Navigation'
import Footer from './common/Footer'
import { useFetchUserQuery } from '../redux/userApi'
import Spinner from './common/Spinner'
import ProtectedRoute from './ProtectedRoute'

const Root: FC = () => {
    const dispatch = useDispatch()
    const location = useLocation()

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
