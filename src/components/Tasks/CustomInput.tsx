import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'
import { Input } from 'reactstrap'

interface CustomInputProps {
    value?: string | null;
    type: string;
    placeholder?: string;
    maxLength: number;
    onSave: (value: string) => string;
}

export class CustomInput extends Component<CustomInputProps> {

    state = { value: this.props.value }
    private taskNameInput: HTMLInputElement | undefined

    render() {
        const { type, placeholder, maxLength, onSave } = this.props
        const { value } = this.state

        if (type === 'textarea') return (
            <Textarea placeholder={placeholder}
                      value={value || ''}
                      onChange={this.handleValueChange}
                      minRows={3}
                      maxRows={15}
                      onBlur={() => onSave(value!)}
                      className="form-control"
                      maxLength={maxLength}/>
        )

        return (
            <Input type={type}
                   placeholder={placeholder}
                   value={value || ''}
                   onChange={this.handleValueChange}
                   onBlur={() => onSave(value!)}
                   maxLength={maxLength}
                   onKeyPress={(target: React.KeyboardEvent) => target.key === 'Enter' && this.blurAndSave(value!)}
                   innerRef={(input: HTMLInputElement) => this.taskNameInput = input}/>
        )
    }

    handleValueChange = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = target
        this.setState({ value })
    }

    blurAndSave = (value: string) => {
        const { onSave } = this.props
        const valueAfterSave = onSave(value)
        if (valueAfterSave) {
            this.setState({ value: valueAfterSave })
        }
        this.taskNameInput?.blur()
    }
}
