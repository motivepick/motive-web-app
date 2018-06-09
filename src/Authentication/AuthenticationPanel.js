import React, {Component} from 'react';
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

class AuthenticationPanel extends Component {

    render() {
        console.log('Local storage item was', localStorage.getItem('token'));
        return (
            localStorage.getItem('token') ? <LogoutButton/> : <LoginButton/>
        );
    }
}

export default AuthenticationPanel;
