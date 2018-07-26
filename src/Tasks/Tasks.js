import React, {Component} from 'react';
import {connect} from 'react-redux';
import LogoutButton from '../Authentication/LogoutButton';
import {Col, Input, ListGroup, ListGroupItem, Nav, Navbar, NavbarBrand, NavItem, Row} from 'reactstrap';
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
                        this.taskNameInput.focus();
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
        const component = this;

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
                    <div>
                        <br/>
                        <Row>
                            <Col>
                                <Input type="text" name="name" id="exampleEmail" placeholder="Write new task"
                                       onKeyPress={this.onAddNewTask.bind(this)} autoFocus innerRef={input => this.taskNameInput = input}/>
                            </Col>
                        </Row>
                        <Row style={{marginTop: '10px'}}>
                            <Col>
                                <ListGroup>
                                    {tasks.map(task => (
                                        <ListGroupItem key={task.id}>
                                            <div className="d-flex justify-content-between">
                                                {task.name}
                                                <div>
                                                    <Input type="checkbox" style={{'margin-left': '-0.65rem'}}
                                                           onClick={component.onCloseTask.bind(component, task.id)}/>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </Col>
                        </Row>
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
