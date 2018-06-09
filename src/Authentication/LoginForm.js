import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

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
            localStorage.setItem('token', access_token);
            fetch(`https://graph.facebook.com/me?access_token=${access_token}`, {
                method: 'GET'
            }).then(r => r.json()).then(({id, name}) => {
                localStorage.setItem('userId', id);
                localStorage.setItem('userName', name);
                console.log('Sending user ID, user name and access token to the server...', id, name, access_token);
            });
            this.props.history.push(`/`);
        });
    }
}

export default withRouter(LoginForm);
