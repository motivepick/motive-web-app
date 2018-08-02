import React, {Component} from 'react';
import {Button, Col, Form, FormGroup, Input, Row} from "reactstrap";
import moment from "moment";
import FontAwesome from 'react-fontawesome';
import './Task.css';
import {API_URL} from "../const";

class Task extends Component {

    state = {name: this.props.value.name, description: this.props.value.description, opened: false};

    render() {
        const {value, onClose} = this.props;
        const {dueDate} = value;
        const due = dueDate ? moment(dueDate, moment.ISO_8601) : null;

        return (
            <Row className="task-wrapper">
                <Col>
                    <div className="task">
                        <div onClick={this.handleTaskClick} style={{cursor: 'pointer'}} className="task-name">
                            <Button color="link" onClick={() => onClose(value.id)}>
                                <FontAwesome name='check' style={{color: '#000'}}/>
                            </Button>
                            {this.state.name} {due ? ` (${Task.format(due)})` : ''}
                        </div>
                        {this.state.opened && <Row>
                            <Col>
                                <Form style={{padding: '.65rem 0.6rem'}}>
                                    <FormGroup>
                                        <Input type="text" value={this.state.name} onChange={this.handleNameChange}
                                               onBlur={this.handleNameBlur}/>
                                    </FormGroup>
                                    <FormGroup style={{marginBottom: '0'}}>
                                        <Input type="textarea" value={this.state.description}
                                               onChange={this.handleDescriptionChange}
                                               onBlur={this.handleDescriptionBlur}
                                               placeholder={'Add task description'}/>
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>}
                    </div>
                </Col>
            </Row>
        );
    }

    handleTaskClick = () => {
        const {opened} = this.state;
        this.setState({opened: !opened});
    };

    handleNameChange = ({target}) => {
        this.setState({name: target.value});
    };

    handleDescriptionChange = ({target}) => {
        this.setState({description: target.value});
    };

    handleNameBlur = () => {
        const {value} = this.props;
        fetch(`${API_URL}/tasks/${value.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({name: this.state.name})
        });
    };

    handleDescriptionBlur = () => {
        const {value} = this.props;
        fetch(`${API_URL}/tasks/${value.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({description: this.state.description})
        });
    };

    static classOf(due) {
        if (due) {
            const now = new Date();
            if (due.isSame(now, 'day')) {
                return 'list-group-item-secondary';
            } else if (due.isBefore(now, 'day')) {
                return 'list-group-item-dark';
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    static format(due) {
        return due.local().calendar();
    }
}

export default Task;
