import React, {Component} from 'react';

class LoginButton extends Component {

    render() {
        const clientId = '2066377776913735';
        const redirectUrl = encodeURI('https://motiv.yaskovdev.com/login');
        return <a href={`https://www.facebook.com/v3.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUrl}&state=123`}>Login</a>;
    }
}

export default LoginButton;