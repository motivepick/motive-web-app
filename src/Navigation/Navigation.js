import React, {Component} from 'react';
import LogoutButton from "../Authentication/LogoutButton";
import {Nav, Navbar, NavbarBrand, NavItem} from "reactstrap";

class Navigation extends Component {
    render() {
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">Your Tasks</NavbarBrand>
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