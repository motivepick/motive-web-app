import React, {Component} from 'react';
import LogoutButton from "../Authentication/LogoutButton";
import {Nav, Navbar, NavbarBrand, NavItem} from "reactstrap";

class Navigation extends Component {
    render() {
        const {user} = this.props;
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">{user.name.split(' ')[0]}'s Tasks</NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <LogoutButton/>
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }
}

export default Navigation;