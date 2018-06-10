import React, {Component} from 'react';
import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/css/uikit-rtl.min.css';
import './App.css';
import Tasks from "./Tasks/Tasks";
import LoginForm from "./Authentication/LoginForm";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {connect} from "react-redux";
import {setUser} from "./actions";

class App extends Component {

    componentDidMount() {
        const {user, setUser} = this.props;
        if (!user) {
            const id = localStorage.getItem('id');
            if (id) {
                fetch(`https://api-motiv.yaskovdev.com/users/${id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                }).then(r => r.json()).then((user) => {
                    setUser(user);
                });
            } else {
                console.log('nobody was logged in');
            }
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <Route exact={true} path="/" component={Tasks}/>
                    <Route path="/login" component={LoginForm}/>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user
});

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(setUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

