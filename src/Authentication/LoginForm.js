import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {setUser} from "../actions";
import {APP_URL, FACEBOOK_CLIENT_ID} from '../const';

class LoginForm extends Component {

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const code = query.get('code');
        this.exchangeCodeForToken(code);
    }

    render() {
        return (
            <dev>Login is in progress...</dev>
        )
    }

    exchangeCodeForToken = (code) => {
        const clientSecret = '0d9cfee0a17164bdcc1a034a3db9230b'; // TODO: Remove this, please.
        const redirectUrl = encodeURI(`${APP_URL}/login`);
        const url = `https://graph.facebook.com/v3.0/oauth/access_token?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${redirectUrl}&client_secret=${clientSecret}&code=${code}`;
        fetch(url).then(r => r.json()).then(json => {
            const {access_token} = json;
            fetch(`https://graph.facebook.com/me?access_token=${access_token}`).then(r => r.json()).then(({id, name}) => {
                const user = {id, name, token: access_token};
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
