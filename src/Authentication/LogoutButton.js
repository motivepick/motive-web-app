import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {removeUser} from "../actions";
import {connect} from 'react-redux';
import {API_URL} from '../const';

class LogoutButton extends Component {

    render() {
        return <a onClick={this.handleLogout}>Logout</a>;
    }

    handleLogout = () => {
        const {user, removeUser} = this.props;
        fetch(`${API_URL}/users/${user.id}/deletion`, {
            method: 'POST'
        }).then(() => {
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
