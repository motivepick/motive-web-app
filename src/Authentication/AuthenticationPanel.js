import React, {Component} from 'react';
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import {connect} from "react-redux";

class AuthenticationPanel extends Component {

    render() {
        const {user} = this.props;
        return (
            user ? <LogoutButton/> : <LoginButton/>
        );
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationPanel);
