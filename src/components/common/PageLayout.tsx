import React from 'react'
import { IUser } from '../../models/appModel'
import Navigation from '../Navigation/Navigation'
import Footer from './Footer'

interface PageLayoutProps extends React.PropsWithChildren<unknown> {
    user: IUser
    onAllTasksClick?: () => void
}

const PageLayout: React.FC<PageLayoutProps> = ({ user, onAllTasksClick, children }) =>
    <>
        <Navigation isTemporaryUserLoggedIn={user.temporary} onAllTasksClick={onAllTasksClick}/>
        {children}
        <Footer/>
    </>

export default PageLayout
