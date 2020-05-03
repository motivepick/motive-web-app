import React, { Component } from 'react'
import { Input } from 'reactstrap'
import Textarea from 'react-textarea-autosize'

export class CustomInput extends Component {

    state = { value: this.props.value }

    render() {
        const { type, placeholder, maxLength, onSave } = this.props
        const { value } = this.state
        return (
            type === 'textarea' ? <Textarea placeholder={placeholder} value={value || ''} onChange={this.handleValueChange} minRows={3} maxRows={15}
                    onBlur={() => onSave(value)} className="form-control" maxLength={maxLength}/> :
                <Input type={type} placeholder={placeholder} value={value} onChange={this.handleValueChange} onBlur={() => onSave(value)} maxLength={maxLength}
                    onKeyPress={target => target.charCode === 13 && this.blurAndSave(value)} innerRef={input => this.taskNameInput = input}/>
        )
    }

    handleValueChange = ({ target }) => {
        const { value } = target
        this.setState({ value })
    }

    blurAndSave = (value) => {
        const { onSave } = this.props
        const valueAfterSave = onSave(value)
        if (valueAfterSave) {
            this.setState({ value: valueAfterSave })
        }
        this.taskNameInput.blur()
    }
}
