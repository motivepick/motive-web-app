import React, { Component } from 'react'
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap'
import logo from '../logo.png'
import { translate } from 'react-i18next'
import { withCookies } from 'react-cookie'

class Navigation extends Component {

    render() {
        const { t } = this.props
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">
                    <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Motive Logo"/>
                    <span> {t('your.tasks')}</span>
                </NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <a onClick={this.handleLogout} style={{ cursor: 'pointer' }}>{t('logout')}</a>
                    </NavItem>
                </Nav>
            </Navbar>
        )
    }

    handleLogout = () => {
        const { cookies, history } = this.props
        cookies.remove('SESSION')
        history.push('/login')
    };
}

export default withCookies(translate('translations')(Navigation))