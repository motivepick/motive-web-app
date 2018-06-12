import React, {Component} from 'react';
import {Button} from 'reactstrap';

class LoginButton extends Component {

    render() {
        const clientId = '2066377776913735';
        const redirectUrl = encodeURI('https://motiv.yaskovdev.com/login');
        const url = `https://www.facebook.com/v3.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUrl}&state=123`;
        return (
            <Button href={url}>Login With Facebook</Button>
        );
    }
}

export default LoginButton;
