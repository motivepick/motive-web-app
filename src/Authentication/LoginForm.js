import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { createUserData, setUser } from '../actions/userActions'
import { API_URL, APP_URL, FACEBOOK_CLIENT_ID } from '../const'
import SpinnerView from '../SpinnerView'
import 'url-search-params-polyfill'
import request from 'superagent'

class LoginForm extends Component {

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search)
        this.exchangeCodeForToken(query.get('code'), atob(query.get('state')))
    }

    render() {
        return <SpinnerView/>
    }

    exchangeCodeForToken = (code, state) => {
        const expectedState = sessionStorage.getItem('state')
        if (expectedState === state) {
            const redirectUrl = encodeURI(`${APP_URL}/login`)
            request.post(`${API_URL}/users/codes/${code}`).query({ clientId: FACEBOOK_CLIENT_ID, redirectUrl }).then(response => {
                const token = response.text
                fetch(`https://graph.facebook.com/me?access_token=${token}`).then(r => r.json()).then(({ id, name }) => {
                    this.createUser({ accountId: id, name, token })
                })
            })
        } else {
            throw 'expected state ' + expectedState + ' and actual state ' + state + ' are not equal'
        }
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
