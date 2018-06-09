import React, {Component} from 'react'

class LoginForm extends Component {

    render() {
        const query = new URLSearchParams(this.props.location.search);

        const login = () => {
            fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: '72d4b07903134b5aaa52',
                    clientSecret: 'b54153a2a693e3d8ea9f012c863af8706f6fc93c',
                    code: query.get('code'),
                    redirect_uri: 'https://motiv.yaskovdev.com'
                })
            })
                .then(response => response.json())
                .then(
                    (response) => {
                        console.log(response);
                    }
                );
        };
        return (
            <button onClick={login}>Login</button>
        )
    }
}

export default LoginForm
