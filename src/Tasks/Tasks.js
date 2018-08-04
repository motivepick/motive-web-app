import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Input, Row } from 'reactstrap';
import { API_URL } from '../const';
import Task from './Task';
import Navigation from '../Navigation/Navigation';
import moment from 'moment';
import { handleDueDateOf } from './parser';

class Tasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            tasks: []
        };
    }

    componentWillMount() {
        const { user } = this.props;
        const { id } = user;
        fetch(`${API_URL}/users/${id}/tasks`)
            .then(response => response.json())
            .then(
                tasks => this.setState({ tasks: Tasks.ordered(tasks) }),
                error => this.setState({ error })
            );
    }

    onAddNewTask(e) {
        const input = e.target;
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const { props } = this;
            const { id } = props.user;
            const task = handleDueDateOf({ userId: id, name: input.value.trim() });
            input.disabled = true;
            fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(task)
            })
                .then(response => response.json())
                .then(
                    taskWithId => {
                        this.setState({ tasks: [taskWithId].concat(this.state.tasks) });
                        input.value = '';
                        input.disabled = false;
                        this.taskNameInput.focus();
                    }, error => {
                        this.setState({ error });
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
                taskWithId => this.setState({ tasks: this.state.tasks.filter(t => t.id !== taskWithId.id) }),
                error => this.setState({ error })
            );
    };

    render() {
        const { user } = this.props;
        const { tasks } = this.state;
        return (
            <div>
                <Navigation user={user}/>
                <div>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            <Input type="text" name="name" placeholder="Write new task"
                                   onKeyPress={this.onAddNewTask.bind(this)} autoFocus
                                   innerRef={input => this.taskNameInput = input}/>
                        </Col>
                    </Row>
                    <div style={{ marginTop: '10px' }}>
                        {tasks.map(task => <Task key={task.id} value={task} onClose={this.onCloseTask}/>)}
                    </div>
                </div>
            </div>
        );
    }

    static ordered(tasks) {
        return tasks.sort((a, b) => {
            if (Tasks.absent(a.dueDate) && Tasks.absent(b.dueDate)) {
                return 0;
            } else if (Tasks.absent(a.dueDate) && Tasks.present(b.dueDate)) {
                return 1;
            } else if (Tasks.present(a.dueDate) && Tasks.absent(b.dueDate)) {
                return -1;
            } else {
                return Tasks.dueDateOf(a).isAfter(Tasks.dueDateOf(b)) ? 1 : -1;
            }
        });
    }

    static dueDateOf(task) {
        return moment(task.dueDate, moment.ISO_8601);
    }

    static present(value) {
        return !Tasks.absent(value);
    }

    static absent(value) {
        return !value;
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
