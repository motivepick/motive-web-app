import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useHistory } from 'react-router-dom'
import { DropdownItem, DropdownMenu, DropdownToggle, NavbarBrand, UncontrolledDropdown } from 'reactstrap'
import { API_URL, FACEBOOK_AUTH_URL, VK_AUTH_URL } from '../../config'
import { IUser } from '../../models/appModel'

interface NavigationProps {
    user: IUser;
    onAllTasksClick?: () => void
}

const Navigation: React.FC<NavigationProps> = (props) => {
    const { user, onAllTasksClick } = props

    const history = useHistory()
    const { t } = useTranslation()

    const handleAllTasksClick = () => history.push('/')

    const handleVkLogin = () => {
        window.location.href = VK_AUTH_URL
    }

    const handleFacebookLogin = () => {
        window.location.href = FACEBOOK_AUTH_URL
    }

    const handleLogout = async () => {
        window.location.href = `${API_URL}/logout`
    }

    return (
        <nav className="navbar navbar-expand navbar-light bg-light" style={{ borderRadius: '.25rem' }}>
            <NavbarBrand href="/">
                <img src='/logo.png' width="30" height="30" className="d-inline-block align-top" alt="Motive Logo"/>
            </NavbarBrand>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" exact to="/" onClick={onAllTasksClick || handleAllTasksClick} style={{ cursor: 'pointer' }}>
                            {t('allTasks')}
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/schedule">
                            {t('schedule')}
                        </NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <UncontrolledDropdown>
                        <DropdownToggle nav>
                            <i className="fa fa-bars"/>
                        </DropdownToggle>
                        <DropdownMenu right>
                            {user.temporary &&
                            <DropdownItem onClick={handleVkLogin}>
                                <i className="fa fa-vk" style={{ marginRight: '0.1em' }}/> {t('login.vk')}
                            </DropdownItem>}
                            {user.temporary &&
                            <DropdownItem onClick={handleFacebookLogin}>
                                <i className="fa fa-facebook-square" style={{ marginRight: '0.1em' }}/> {t('login.facebook')}
                            </DropdownItem>}
                            <DropdownItem className={user.temporary ? 'text-danger' : ''} onClick={handleLogout}>
                                <i className="fa fa-sign-out" style={{ marginRight: '0.3em' }}/> {user.temporary ? t('deleteTasksAndLogout') : t('logout')}
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </ul>
            </div>
        </nav>
    )
}

export default Navigation
