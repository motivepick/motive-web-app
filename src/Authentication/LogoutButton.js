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
        logout(user.accountId).then(() => {
            localStorage.removeItem('id')
            removeUser()
        })
    };
}

const mapStateToProps = state => ({
    user: state.user.user
})

const mapDispatchToProps = {
    removeUser,
    logout
}

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(LogoutButton))
