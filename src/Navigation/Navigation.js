import React, { PureComponent } from 'react'
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap'
import logo from '../logo.png'
import { translate } from 'react-i18next'
import { withCookies } from 'react-cookie'
import { logout } from '../services/logoutService'

class Navigation extends PureComponent {

    render() {
        const { t } = this.props
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">
                    <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Motive Logo"/>
                    <span> {t('my.tasks')}</span>
                </NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <a onClick={this.handleLogout} style={{ cursor: 'pointer' }}>{t('logout')}</a>
                    </NavItem>
                </Nav>
            </Navbar>
        )
    }

    handleLogout = async () => {
        await logout()
        this.props.history.push('/login')
    }
}

export default withCookies(translate('translations')(Navigation))
