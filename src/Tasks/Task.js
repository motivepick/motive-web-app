import React, {Component} from 'react';
import {Input, ListGroupItem} from "reactstrap";

class Task extends Component {

    render() {
        const {value, onClose} = this.props;
        return (
            <ListGroupItem key={value.id}>
                <div className="d-flex justify-content-between">
                    {value.name}
                    <div>
                        <Input type="checkbox" style={{'margin-left': '-0.65rem'}} onClick={() => onClose(value.id)}/>
                    </div>
                </div>
            </ListGroupItem>
        );
    }
}

export default Task;
