import React, {Component} from 'react';
import './App.css';
import Tasks from './Tasks/Tasks';
import LoginForm from './Authentication/LoginForm';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {Container} from 'reactstrap';
import LoginView from './Authentication/LoginView';
import ErrorBoundary from './ErrorBoundary';
import SpinnerView from "./SpinnerView";

class App extends Component {

    render() {
        return (
            <Router>
                <ErrorBoundary>
                    <Container>
                        <Route exact={true} path="/" component={this.mainComponent()}/>
                        <Route path="/login" component={LoginForm}/>
                        <Route path="/development" component={LoginView}/>
                    </Container>
                </ErrorBoundary>
            </Router>
        );
    }

    mainComponent = () => {
        const {user, done} = this.props;
        if (done) {
            return user ? Tasks : LoginView;
        } else {
            return SpinnerView;
        }
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user,
    done: state.authentication.done
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
