import React, { FC, useCallback } from 'react'
import PageLayout from './common/PageLayout'
import { Outlet, useLocation } from 'react-router-dom'
import { Container } from 'reactstrap'
import { setCurrentTaskListToInbox } from '../redux/actions/taskActions'
import { useDispatch } from 'react-redux'

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

    return (
        <Container>
            <PageLayout onAllTasksClick={handleAllTasksClick}>
                <Outlet/>
            </PageLayout>
        </Container>
    )
}

export default Root
