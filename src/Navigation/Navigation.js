import React, { PureComponent } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, i, Nav, Navbar, NavbarBrand, UncontrolledDropdown } from 'reactstrap'
import logo from '../logo.png'
import { translate } from 'react-i18next'
import { withCookies } from 'react-cookie'
import { API_URL, COOKIE_DOMAIN, COOKIE_PATH } from '../const'

class Navigation extends PureComponent {

    render() {
        const { user, t } = this.props
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">
                    <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Motive Logo"/>
                </NavbarBrand>
                <Nav className="ml-auto" navbar>
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
                </Nav>
            </Navbar>
        )
    }

    handleVkLogin = () => {
        window.location.href = `${API_URL}/oauth2/authorization/vk`
    }

    handleFacebookLogin = () => {
        window.location.href = `${API_URL}/oauth2/authorization/facebook`
    }

    handleLogout = () => {
        const { cookies, history } = this.props
        cookies.remove('SESSION', { domain: COOKIE_DOMAIN, path: COOKIE_PATH })
        history.push('/login')
    }
}

export default withCookies(translate('translations')(Navigation))
