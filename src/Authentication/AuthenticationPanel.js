import React, {Component} from 'react';
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

class AuthenticationPanel extends Component {

    render() {
        return (
            localStorage.getItem('user') ? <LogoutButton/> : <LoginButton/>
        );
    }
}

export default AuthenticationPanel;
