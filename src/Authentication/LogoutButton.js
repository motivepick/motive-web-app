import React, {Component} from 'react';
import {withRouter} from "react-router-dom";

class LogoutButton extends Component {

    render() {
        return <a onClick={this.handleLogout}>Logout</a>;
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        this.props.history.push(`/`);
    }
}

export default withRouter(LogoutButton);
