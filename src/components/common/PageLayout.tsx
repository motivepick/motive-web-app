import React from 'react'
import { IUser } from '../../models/appModel'
import Navigation from '../Navigation/Navigation'
import Footer from './Footer'

interface PageLayoutProps {
    user: IUser
}

const PageLayout: React.FC<PageLayoutProps> = ({ user, children }) => {
    return <>
        <Navigation isTemporaryUserLoggedIn={user.temporary}/>
        { children }
        <Footer/>
    </>
}

export default PageLayout