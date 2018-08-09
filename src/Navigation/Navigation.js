import React, { Component } from 'react'
import LogoutButton from '../Authentication/LogoutButton'
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap'
import logo from '../logo.png'

class Navigation extends Component {

    render() {
        const { user } = this.props
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">
                    <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Motiv Logo"/>
                    <span> {user.name.split(' ')[0]}'s Tasks</span>
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

export default Navigation