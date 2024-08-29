import React, { FC, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchTaskLists, resetTaskLists, setTaskListId } from '../redux/reducers/tasksSlice'
import { AppDispatch } from '../redux/store'
import Navigation from './Navigation/Navigation'
import Footer from './common/Footer'
import { api, useFetchUserQuery } from '../redux/api'
import Spinner from './common/Spinner'
import ProtectedRoute from './ProtectedRoute'
import { TASK_LIST_ID } from '../models/appModel'
import { DEFAULT_LIMIT } from '../config'

const Root: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()

    const handleAllTasksClick = useCallback(() => {
        const { pathname } = location
        if (pathname === '/') {
            dispatch(setTaskListId(TASK_LIST_ID.INBOX))
        }
    }, [dispatch, setTaskListId])

    const handleSynchronize = useCallback(() => {
        dispatch(resetTaskLists())
        dispatch(api.util.invalidateTags(['Schedule']));
        [TASK_LIST_ID.INBOX, TASK_LIST_ID.CLOSED].forEach(taskListId => fetchTaskLists({ type: taskListId, offset: 0, limit: DEFAULT_LIMIT }))
    }, [])

    const { data: user, isLoading } = useFetchUserQuery()

    return (
        <div className="container-xl">
            {isLoading ? <Spinner/> : <ProtectedRoute isAllowed={!!user} redirectPath="/login">
                <Navigation isTemporaryUserLoggedIn={user?.temporary} onAllTasksClick={handleAllTasksClick} onSynchronize={handleSynchronize}/>
                <Outlet/>
                <Footer/>
            </ProtectedRoute>}
        </div>
    )
}

export default Root
