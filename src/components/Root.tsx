import React, { FC, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Container } from 'reactstrap'
import { useDispatch } from 'react-redux'
import { setCurrentTaskListToInbox } from '../redux/reducers/taskListSlice'
import { AppDispatch } from '../redux/store'
import Navigation from './Navigation/Navigation'
import Footer from './common/Footer'
import { useFetchUserQuery } from '../redux/userApi'
import Spinner from './common/Spinner'
import ProtectedRoute from './ProtectedRoute'

const Root: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()

    const handleAllTasksClick = useCallback(() => {
        const { pathname } = location
        if (pathname === '/') {
            dispatch(setCurrentTaskListToInbox())
        }
    }, [dispatch, setCurrentTaskListToInbox])

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
