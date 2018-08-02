import React, {Component} from 'react';
import {Button, Col, Row} from "reactstrap";
import moment from "moment";
import FontAwesome from 'react-fontawesome';
import './Task.css';

class Task extends Component {

    render() {
        const {value, onClose} = this.props;
        const {dueDate} = value;
        const due = dueDate ? moment(dueDate, moment.ISO_8601) : null;

        return (
            <Row className={'task-wrapper'}>
                <Col>
                    <div className='task'>
                        <Button color="link" onClick={() => onClose(value.id)}>
                            <FontAwesome name='check' style={{color: '#000'}}/>
                        </Button>
                        {value.name} {due ? ` (${Task.format(due)})` : ''}
                    </div>
                </Col>
            </Row>
        );
    }

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
