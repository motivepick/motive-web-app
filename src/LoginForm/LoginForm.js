import React, {Component} from 'react';

class LoginForm extends Component {

    render() {
        return (
            <form>
                <input value={this.props.location.search}/>
            </form>
        )
    }
}

export default LoginForm
