import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { createUserData, setUser } from '../actions/userActions'
import { APP_URL, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } from '../const'
import SpinnerView from '../SpinnerView'
import 'url-search-params-polyfill'

class LoginForm extends Component {

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search)
        const code = query.get('code')
        this.exchangeCodeForToken(code)
    }

    render() {
        return (
            <SpinnerView/>
        )
    }

    exchangeCodeForToken = (code) => {
        const redirectUrl = encodeURI(`${APP_URL}/login`)
        const url = `https://graph.facebook.com/v3.0/oauth/access_token?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${redirectUrl}&client_secret=${FACEBOOK_CLIENT_SECRET}&code=${code}`
        fetch(url).then(r => r.json()).then(json => {
            const { access_token } = json
            fetch(`https://graph.facebook.com/me?access_token=${access_token}`).then(r => r.json()).then(({ id, name }) => {
                const user = { accountId: id, name, token: access_token }
                this.createUser(user)
            })
        })
    }

    createUser = (user) => {
        const { history, setUser, createUserData } = this.props

        createUserData(user).then(() => {
            // TODO: handle exceptional case
            localStorage.setItem('id', user.accountId)
            setUser(user)
            history.push('/')
        })
    }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {
    setUser,
    createUserData
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm))
