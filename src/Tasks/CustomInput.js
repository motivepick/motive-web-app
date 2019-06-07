import React, { PureComponent } from 'react'
import { Input } from 'reactstrap'

export class CustomInput extends PureComponent {

    state = { value: this.props.value }

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
