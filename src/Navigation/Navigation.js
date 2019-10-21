import React, { PureComponent } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, i, NavbarBrand, UncontrolledDropdown } from 'reactstrap'
import logo from '../logo.png'
import { translate } from 'react-i18next'
import { API_URL } from '../const'
import { Link } from 'react-router-dom'

class Navigation extends PureComponent {

    render() {
        const { user, t } = this.props
        return (
            <nav className="navbar navbar-expand navbar-light bg-light">
                <NavbarBrand href="/">
                    <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Motive Logo"/>
                </NavbarBrand>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        {/* TODO: make active work again */}
                        <li className="nav-item">
                            <Link className="nav-link" to='/'>
                                {t('allTasks')}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/schedule'>
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

    handleVkLogin = () => {
        window.location.href = `${API_URL}/oauth2/authorization/vk`
    }

    handleFacebookLogin = () => {
        window.location.href = `${API_URL}/oauth2/authorization/facebook`
    }

    handleLogout = async () => {
        window.location.href = `${API_URL}/logout`
    }
}

export default translate('translations')(Navigation)
