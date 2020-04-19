import React, { Component } from 'react'
import { Input } from 'reactstrap'
import Textarea from 'react-textarea-autosize'

export class CustomInput extends Component {

    state = { value: this.props.value }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value })
    }

    render() {
        const { type, placeholder, maxLength, onSave } = this.props
        const { value } = this.state
        return (
            type === 'textarea' ? <Textarea placeholder={placeholder} value={value} onChange={this.handleValueChange} minRows="3" maxRows="15"
                    onBlur={() => onSave(value)} innerRef={input => this.taskNameInput = input} className="form-control" maxlength={maxLength}/> :
                <Input type={type} placeholder={placeholder} value={value} onChange={this.handleValueChange} onBlur={() => onSave(value)} maxlength={maxLength}
                    onKeyPress={target => target.charCode === 13 && this.blurAndSave(value)} innerRef={input => this.taskNameInput = input}/>
        )
    }

    handleValueChange = ({ target }) => {
        const { value } = target
        this.setState({ value })
    }

    blurAndSave = (value) => {
        const { onSave } = this.props
        onSave(value)
        this.taskNameInput.blur()
    }
}
