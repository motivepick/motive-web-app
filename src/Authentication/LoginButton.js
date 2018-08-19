import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { APP_URL, FACEBOOK_CLIENT_ID } from '../const'
import { translate } from 'react-i18next'
import uuid from 'uuid'

class LoginButton extends Component {

    render() {
        const { t } = this.props
        return <Button onClick={this.login}>{t('login')}</Button>
    }

    login = () => {
        const state = uuid()
        sessionStorage.setItem('state', state)
        const redirectUrl = encodeURI(`${APP_URL}/login`)
        window.location.href = `https://www.facebook.com/v3.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${redirectUrl}&state=${btoa(state)}`
    }
}

export default translate('translations')(LoginButton)
