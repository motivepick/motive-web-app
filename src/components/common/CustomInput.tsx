import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { useDebouncedCallback } from 'use-debounce'

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

    const handleValueChange = useCallback(({ target }: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        setValue(target.value)
    }, [])

    if (type === 'textarea') {
        const debounced = useDebouncedCallback(({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
            onSave(target.value)
        }, 500)
        useEffect(() => () => {
            debounced.flush()
        }, [])
        useEffect(() => {
            const handleBeforeUnload = (event: BeforeUnloadEvent) => {
                if (debounced.isPending()) {
                    event.preventDefault()
                }
            }
            window.addEventListener('beforeunload', handleBeforeUnload)
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload)
            }
        }, [])
        return (
            <Textarea
                placeholder={placeholder}
                value={value || ''}
                onChange={e => {
                    handleValueChange(e)
                    debounced(e)
                }}
                minRows={3}
                maxRows={15}
                className="form-control"
                maxLength={maxLength}
            />
        )
    }

    const taskNameInput = useRef<HTMLInputElement | null>(null)
    const blurAndSave = useCallback((value: string) => {
        const valueAfterSave = onSave(value)
        if (valueAfterSave) {
            setValue(valueAfterSave)
        }
        taskNameInput.current?.blur()
    }, [onSave])

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