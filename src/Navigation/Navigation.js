import React, { PureComponent } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, UncontrolledDropdown } from 'reactstrap'
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
                        <DropdownToggle nav>{user.temporary ? 'Temporary User' : user.name}</DropdownToggle>
                        <DropdownMenu right>
                            {user.temporary && <DropdownItem onClick={this.handleVkLogin}>{t('login.vk')}</DropdownItem>}
                            {user.temporary && <DropdownItem onClick={this.handleFacebookLogin}>{t('login.facebook')}</DropdownItem>}
                            <DropdownItem onClick={this.handleLogout}>{user.temporary ? t('deleteTasksAndLogout') : t('logout')}</DropdownItem>
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
