import React, { Component } from 'react'
import { Input } from 'reactstrap'

export class CustomInput extends Component {

    state = { value: this.props.value }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value })
    }

    render() {
        const { type, placeholder, saveOnEnter, onSave } = this.props
        const { value } = this.state
        return (
            <Input type={type} placeholder={placeholder} value={value} onChange={this.handleValueChange} onBlur={() => onSave(value)}
                   onKeyPress={target => saveOnEnter && target.charCode === 13 && this.blurAndSave(value)} innerRef={input => this.taskNameInput = input}/>
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
