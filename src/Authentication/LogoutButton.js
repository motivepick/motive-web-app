import React, { Component } from 'react'
import { removeUser } from '../actions'
import { connect } from 'react-redux'
import { API_URL } from '../const'
import { translate } from 'react-i18next'

class LogoutButton extends Component {

    render() {
        const { t } = this.props
        return <a onClick={this.handleLogout} style={{ cursor: 'pointer' }}>{t('logout')}</a>
    }

    handleLogout = () => {
        const { user, removeUser } = this.props
        fetch(`${API_URL}/users/${user.id}`, {
            method: 'DELETE'
        }).then(() => {
            removeUser()
        })
    };
}

const mapStateToProps = state => ({
    user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
    removeUser: () => dispatch(removeUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(LogoutButton))
