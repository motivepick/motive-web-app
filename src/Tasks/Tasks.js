import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Col, Input, ListGroup, Row} from 'reactstrap';
import {API_URL} from "../const";
import Task from "./Task";
import Navigation from "../Navigation/Navigation";

class Tasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            tasks: []
        };
    }

    componentWillMount() {
        const {user} = this.props;
        const {id} = user;
        fetch(`${API_URL}/users/${id}/tasks`)
            .then(response => response.json())
            .then(
                tasks => this.setState({tasks}),
                error => this.setState({error})
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
                    taskWithId => {
                        component.setState({tasks: [taskWithId].concat(component.state.tasks)});
                        input.value = '';
                        input.disabled = false;
                        this.taskNameInput.focus();
                    }, error => {
                        component.setState({error});
                        input.disabled = false;
                    }
                );
        }
    }

    onCloseTask = (id) => {
        fetch(`${API_URL}/closed-tasks/${id}`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(
                taskWithId => this.setState({tasks: this.state.tasks.filter(t => t.id !== taskWithId.id)}),
                error => this.setState({error})
            );
    };

    render() {
        const {tasks} = this.state;
        return (
            <div>
                <Navigation/>
                <div>
                    <Row style={{marginTop: '10px'}}>
                        <Col>
                            <Input type="text" name="name" id="exampleEmail" placeholder="Write new task"
                                   onKeyPress={this.onAddNewTask.bind(this)} autoFocus
                                   innerRef={input => this.taskNameInput = input}/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: '10px'}}>
                        <Col>
                            <ListGroup>
                                {tasks.map(task => <Task value={task} onClose={this.onCloseTask}/>)}
                            </ListGroup>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
