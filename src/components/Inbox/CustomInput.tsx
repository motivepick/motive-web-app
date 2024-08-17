import React, { FC, useCallback, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'

interface Props {
    value?: string | null;
    type: string;
    placeholder?: string;
    maxLength: number;
    onSave: (value: string) => string;
}

export const CustomInput: FC<Props> = (props) => {
    const { type, placeholder, maxLength, onSave } = props
    const [value, setValue] = useState(props.value)

    const taskNameInput = useRef<HTMLInputElement | null>(null)

    const handleValueChange = useCallback(({ target }: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        setValue(target.value)
    }, [])

    const blurAndSave = useCallback((value: string) => {
        const valueAfterSave = onSave(value)
        if (valueAfterSave) {
            setValue(valueAfterSave)
        }
        taskNameInput.current?.blur()
    }, [onSave])

    if (type === 'textarea') {
        return (
            <Textarea
                placeholder={placeholder}
                value={value || ''}
                onChange={handleValueChange}
                minRows={3}
                maxRows={15}
                onBlur={() => onSave(value!)}
                className="form-control"
                maxLength={maxLength}
            />
        )
    }
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value || ''}
            className="form-control"
            onChange={handleValueChange}
            onBlur={() => onSave(value!)}
            maxLength={maxLength}
            onKeyDown={(target: React.KeyboardEvent) => target.key === 'Enter' && blurAndSave(value!)}
            ref={(input: HTMLInputElement) => taskNameInput.current = input}
        />
    )
}
