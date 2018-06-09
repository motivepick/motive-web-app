import React, {Component} from 'react'

class LoginForm extends Component {

    render() {
        const query = new URLSearchParams(this.props.location.search);
        const clientId = '2066377776913735';
        const clientSecret = '0d9cfee0a17164bdcc1a034a3db9230b';
        const redirectUrl = encodeURI('https://motiv.yaskovdev.com/login');
        const code = query.get('code');
        const url = `https://graph.facebook.com/v3.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUrl}&client_secret=${clientSecret}&code=${code}`;
        return (
            <a href={url}>Login</a>
        )
    }
}

export default LoginForm
