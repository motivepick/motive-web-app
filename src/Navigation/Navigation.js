import React, { Component } from 'react'
import LogoutButton from '../Authentication/LogoutButton'
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap'
import logo from '../logo.png'
import { translate } from 'react-i18next'

class Navigation extends Component {

    render() {
        const { user, t } = this.props
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">
                    <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Motiv Logo"/>
                    <span> {t('your.tasks', { name: user.name.split(' ')[0] })}</span>
                </NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <LogoutButton/>
                    </NavItem>
                </Nav>
            </Navbar>
        )
    }
}

export default translate('translations')(Navigation)