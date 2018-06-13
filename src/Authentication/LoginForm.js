import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {setUser} from "../actions";

class LoginForm extends Component {

    render() {
        const query = new URLSearchParams(this.props.location.search);
        const code = query.get('code');
        return (
            <dev>Login is in progress...
                <button onClick={() => this.exchangeCodeForToken(code)} value={'Exchange'}>Exchange</button>
            </dev>
        )
    }

    exchangeCodeForToken = (code) => {
        const clientId = '2066377776913735';
        const clientSecret = '0d9cfee0a17164bdcc1a034a3db9230b';
        const redirectUrl = encodeURI('https://motiv.yaskovdev.com/login');
        const url = `https://graph.facebook.com/v3.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUrl}&client_secret=${clientSecret}&code=${code}`;
        fetch(url, {
            method: 'GET'
        }).then(r => r.json()).then(json => {
            const {access_token} = json;
            console.log('retrieved token', access_token);
            fetch(`https://graph.facebook.com/me?access_token=${access_token}`, {
                method: 'GET'
            }).then(r => r.json()).then(({id, name}) => {
                const user = {id, name, token: access_token};
                console.log('retrieved user', user);
                this.createUser(user);
            });
        });
    };

    createUser = (user) => {
        const {history, setUser} = this.props;
        fetch(`https://api-motiv.yaskovdev.com/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(user)
        }).then(r => r.json()).then(() => {
            console.log('created user in backend, setting its ID', user);
            localStorage.setItem('id', user.id);
            setUser(user);
            history.push('/')
        });
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    setUser: (user) => dispatch(setUser(user))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));
