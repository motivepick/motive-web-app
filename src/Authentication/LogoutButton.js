import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {removeUser} from "../actions";
import {connect} from 'react-redux';

class LogoutButton extends Component {

    render() {
        return <a onClick={this.handleLogout}>Logout</a>;
    }

    handleLogout = () => {
        const {user, removeUser} = this.props;
        fetch(`https://api-motiv.yaskovdev.com/users/${user.id}/deletion`, {
            method: 'POST'
        }).then(() => {
            localStorage.removeItem('id');
            removeUser();
        });
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user
});

const mapDispatchToProps = dispatch => ({
    removeUser: () => dispatch(removeUser())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LogoutButton));
