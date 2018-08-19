import React, { Component } from 'react'
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap'
import logo from '../logo.png'
import { translate } from 'react-i18next'
import { logout } from '../actions/userActions'
import { connect } from 'react-redux'

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
        const { logout, history } = this.props
        logout().then(() => history.push('/login'))
    };
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {
    logout
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(Navigation))