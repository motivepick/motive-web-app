import React, { Component } from 'react'
import { logout, removeUser } from '../actions/userActions'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

class LogoutButton extends Component {

    render() {
        const { t } = this.props
        return <a onClick={this.handleLogout} style={{ cursor: 'pointer' }}>{t('logout')}</a>
    }

    handleLogout = () => {
        const { user, logout, removeUser } = this.props
        logout(user.accountId).then(() => removeUser())
    };
}

const mapStateToProps = state => ({
    user: state.user.user
})

const mapDispatchToProps = dispatch => ({
    removeUser: () => dispatch(removeUser()),
    logout: (accountId) => dispatch(logout(accountId))
})

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(LogoutButton))
