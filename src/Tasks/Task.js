import React, {Component} from 'react';
import {Input, ListGroupItem} from "reactstrap";
import moment from "moment";

class Task extends Component {

    render() {
        const {value, onClose} = this.props;
        const {dueDate} = value;
        const due = dueDate ? moment(dueDate, moment.ISO_8601) : null;

        return (
            <ListGroupItem className={`${Task.classOf(due)} list-group-item-action`}>
                <div className="d-flex justify-content-between">
                    {value.name} {due ? ` (${Task.format(due)})` : ''}
                    <div>
                        <Input type="checkbox" style={{marginLeft: '-0.65rem'}} onClick={() => onClose(value.id)}/>
                    </div>
                </div>
            </ListGroupItem>
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
