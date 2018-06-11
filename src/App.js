import React, {Component} from 'react';
import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/css/uikit-rtl.min.css';
import './App.css';
import Tasks from "./Tasks/Tasks";
import LoginForm from "./Authentication/LoginForm";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {connect} from "react-redux";

class App extends Component {

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

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
