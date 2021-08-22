import { History } from 'history'
import React, { PureComponent } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DropdownItem, DropdownMenu, DropdownToggle, NavbarBrand, UncontrolledDropdown } from 'reactstrap'
import { API_URL, FACEBOOK_AUTH_URL, VK_AUTH_URL } from '../../config'
import { history } from '../../index'
import { IUser } from '../../models/appModel'

interface NavigationProps extends WithTranslation {
    history: History;
    user: IUser;
    onAllTasksClick?: () => void
}

class Navigation extends PureComponent<NavigationProps> {

    render() {
        const { user, onAllTasksClick, t } = this.props
        return (
            <nav className="navbar navbar-expand navbar-light bg-light" style={{ borderRadius: '.25rem' }}>
                <NavbarBrand href="/">
                    <img src='/logo.png' width="30" height="30" className="d-inline-block align-top" alt="Motive Logo"/>
                </NavbarBrand>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        {/* TODO: make active work again */}
                        <li className="nav-item">
                            {/* eslint-disable-next-line */}
                            <a className="nav-link" onClick={onAllTasksClick || this.handleAllTasksClick} style={{ cursor: 'pointer' }}>
                                {t('allTasks')}
                            </a>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/schedule">
                                {t('schedule')}
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <UncontrolledDropdown>
                            <DropdownToggle nav>
                                <i className="fa fa-bars"/>
                            </DropdownToggle>
                            <DropdownMenu right>
                                {user.temporary &&
                                <DropdownItem onClick={this.handleVkLogin}>
                                    <i className="fa fa-vk" style={{ marginRight: '0.1em' }}/> {t('login.vk')}
                                </DropdownItem>}
                                {user.temporary &&
                                <DropdownItem onClick={this.handleFacebookLogin}>
                                    <i className="fa fa-facebook-square" style={{ marginRight: '0.1em' }}/> {t('login.facebook')}
                                </DropdownItem>}
                                <DropdownItem className={user.temporary ? 'text-danger' : ''} onClick={this.handleLogout}>
                                    <i className="fa fa-sign-out" style={{ marginRight: '0.3em' }}/>
                                    {user.temporary ? t('deleteTasksAndLogout') : t('logout')}
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </ul>
                </div>
            </nav>
        )
    }

    handleAllTasksClick = () => {
        history.push('/')
    }

    handleVkLogin = () => {
        window.location.href = VK_AUTH_URL
    }

    handleFacebookLogin = () => {
        window.location.href = FACEBOOK_AUTH_URL
    }

    handleLogout = async () => {
        window.location.href = `${API_URL}/logout`
    }
}

export default withTranslation()(Navigation)
