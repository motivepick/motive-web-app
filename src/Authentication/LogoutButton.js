import React, {Component} from 'react';
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

export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton);
