import React, {Component} from 'react';
import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/css/uikit-rtl.min.css';
import './App.css';
import Tasks from './Tasks/Tasks';
import LoginForm from './Authentication/LoginForm';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {Container} from 'reactstrap';
import LoginView from './Authentication/LoginView';

class App extends Component {

    render() {
        const {user} = this.props;
        return (
            <Router>
                <Container>
                    <Route exact={true} path="/" component={user ? Tasks : LoginView}/>
                    <Route path="/login" component={LoginForm}/>
                    <Route path="/development" component={LoginView}/>
                </Container>
            </Router>
        );
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
