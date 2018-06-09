import React, {Component} from 'react'

class LoginForm extends Component {

    render() {
        const query = new URLSearchParams(this.props.location.search);

        const login = () => {
            const form = new FormData();
            form.append('clientId', '72d4b07903134b5aaa52');
            form.append('clientSecret', 'b54153a2a693e3d8ea9f012c863af8706f6fc93c');
            form.append('code', query.get('code'));
            form.append('redirect_uri', 'https://motiv.yaskovdev.com');
            fetch('https://github.com/login/oauth/access_token', {
                method: 'post',
                headers: {
                    'Accept': 'application/json'
                },
                body: form
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
