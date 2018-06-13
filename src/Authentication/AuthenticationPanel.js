import React, {Component} from 'react';
import Tasks from "../Tasks/Tasks";
import {connect} from "react-redux";
import LoginView from "./LoginView";

class AuthenticationPanel extends Component {

    render() {
        const {user} = this.props;
        return (
            user ? <Tasks/> : <LoginView/>
        );
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationPanel);
