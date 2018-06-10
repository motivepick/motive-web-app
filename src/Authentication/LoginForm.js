import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {setUser} from "../actions";
import {connect} from 'react-redux';

class LoginForm extends Component {

    render() {
        const query = new URLSearchParams(this.props.location.search);
        const code = query.get('code');
        this.exchangeCodeForToken(code);
        return (
            <dev>Login is in progress...</dev>
        )
    }

    exchangeCodeForToken = (code) => {
        const clientId = '2066377776913735';
        const clientSecret = '0d9cfee0a17164bdcc1a034a3db9230b';
        const redirectUrl = encodeURI('https://motiv.yaskovdev.com/login');
        const url = `https://graph.facebook.com/v3.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUrl}&client_secret=${clientSecret}&code=${code}`;
        fetch(url, {
            method: 'GET'
        }).then(r => r.json()).then(json => {
            const {access_token} = json;
            fetch(`https://graph.facebook.com/me?access_token=${access_token}`, {
                method: 'GET'
            }).then(r => r.json()).then(({id, name}) => {
                this.createUser({id, name, token: access_token});
            });
        });
    };

    createUser = (user) => {
        console.log('Sending user to the server...', user);

        fetch(`https://api-motiv.yaskovdev.com/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(user)
        }).then(r => r.json()).then(() => {
            localStorage.setItem('id', user.id);
            this.props.history.push(`/`);
        });
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(setUser(user))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));
