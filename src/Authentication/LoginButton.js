import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { APP_URL, FACEBOOK_CLIENT_ID } from '../const'
import { translate } from 'react-i18next'

class LoginButton extends Component {

    render() {
        const { t } = this.props
        const redirectUrl = encodeURI(`${APP_URL}/login`)
        const url = `https://www.facebook.com/v3.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${redirectUrl}&state=123`
        return (
            <Button href={url}>{t('login')}</Button>
        )
    }
}

export default translate('translations')(LoginButton)
