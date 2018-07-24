import React, {Component} from 'react';
import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/css/uikit-rtl.min.css';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import {connect} from 'react-redux';
import LogoutButton from '../Authentication/LogoutButton';
import {Nav, Navbar, NavbarBrand, NavItem} from 'reactstrap';
import {API_URL} from "../const";

class Tasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            tasks: [],
            closingTask: false
        };
    }

    componentWillMount() {
        const {user} = this.props;
        const {id} = user;
        fetch(`${API_URL}/users/${id}/tasks`)
            .then(response => response.json())
            .then(
                (json) => {
                    this.setState({
                        isLoaded: true,
                        tasks: json
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    onAddNewTask(e) {
        const input = e.target;
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const component = this;
            const {props} = this;
            const {id} = props.user;
            const task = {userId: id, name: input.value};
            input.disabled = true;
            fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(task)
            })
                .then(response => response.json())
                .then(
                    (taskWithId) => {
                        component.setState({tasks: [taskWithId].concat(component.state.tasks)});
                        input.value = '';
                        input.disabled = false;
                    }, (error) => {
                        component.setState({error});
                        input.disabled = false;
                    }
                );
        }
    }

    onCloseTask(id) {
        const component = this;
        component.setState({closingTask: true});
        fetch(`${API_URL}/closed-tasks/${id}`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(
                (taskWithId) => {
                    component.setState({
                        tasks: component.state.tasks.filter(t => t.id !== taskWithId.id),
                        closingTask: false
                    });
                }, (error) => {
                    component.setState({error, closingTask: false});
                }
            );
    }

    navigation = () => {
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">Your Tasks</NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <LogoutButton/>
                    </NavItem>
                </Nav>
            </Navbar>
        );
    };

    render() {
        UIkit.use(Icons);
        const component = this;

        function close(closingTask, taskId) {
            if (closingTask) {
                return <span data-uk-spinner={''}/>;
            } else {
                return <a href="javascript:void(0)" onClick={component.onCloseTask.bind(component, taskId)}
                          data-uk-icon="icon: check"/>;
            }
        }

        const {error, isLoaded, tasks, closingTask} = this.state;
        const {user} = this.props;
        if (error) {
            return (
                <div>
                    {this.navigation()}
                    <div className="uk-container uk-container-small">
                        <br/>
                        Error: {error.message}
                    </div>
                </div>
            );
        } else if (!isLoaded || !user) {
            return (
                <div>
                    {this.navigation()}
                    <div className="uk-container uk-container-small">
                        <br/>
                        Loading...
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {this.navigation()}
                    <div className="uk-container uk-container-small">
                        <br/>
                        <div className="uk-flex uk-flex-between uk-flex-middle">
                            <input className="uk-input" type="text" placeholder="Write new task"
                                   onKeyPress={this.onAddNewTask.bind(this)}/>
                        </div>
                        <ul className="uk-list uk-list-divider">
                            {tasks.map(task => (
                                <li key={task.id}>
                                    <div className="uk-flex uk-flex-between uk-flex-middle">
                                        {task.name}
                                        {close(closingTask, task.id)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
