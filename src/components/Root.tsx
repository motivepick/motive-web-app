import React, { FC, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setTaskListId } from '../redux/reducers/tasksSlice'
import { AppDispatch } from '../redux/store'
import Navigation from './Navigation/Navigation'
import Footer from './common/Footer'
import { useFetchUserQuery } from '../redux/api'
import Spinner from './common/Spinner'
import ProtectedRoute from './ProtectedRoute'
import { TASK_LIST_ID } from '../models/appModel'

const Root: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()

    const handleAllTasksClick = useCallback(() => {
        const { pathname } = location
        if (pathname === '/') {
            dispatch(setTaskListId(TASK_LIST_ID.INBOX))
        }
    }, [dispatch, setTaskListId])

    const { data: user, isLoading } = useFetchUserQuery()

    return (
        <div className="container-xl">
            {isLoading ? <Spinner/> : <ProtectedRoute isAllowed={!!user} redirectPath="/login">
                <Navigation isTemporaryUserLoggedIn={user?.temporary} onAllTasksClick={handleAllTasksClick}/>
                <Outlet/>
                <Footer/>
            </ProtectedRoute>}
        </div>
    )
}

export default Root
