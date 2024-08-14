import React from 'react'
import { IUser } from '../../models/appModel'
import { useFetchUserQuery } from '../../redux/userApi'
import Navigation from '../Navigation/Navigation'
import Footer from './Footer'
import Spinner from './Spinner'

interface PageLayoutProps extends React.PropsWithChildren<unknown> {
    onAllTasksClick?: () => void
}

const PageLayout: React.FC<PageLayoutProps> = ({ onAllTasksClick, children }) => {
    const  { data: user, isLoading }  = useFetchUserQuery()

    if (isLoading) return <Spinner />

    return <>
        <Navigation isTemporaryUserLoggedIn={user!.temporary} onAllTasksClick={onAllTasksClick}/>
        {children}
        <Footer/>
    </>
}

export default PageLayout
