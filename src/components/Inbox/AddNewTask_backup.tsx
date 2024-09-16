import { faWandSparkles } from '@fortawesome/free-solid-svg-icons/faWandSparkles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, KeyboardEvent, useCallback, useRef } from 'react'
import { isBrowser } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import AsyncSelect, { useAsync } from 'react-select/async';
import TaskSuggestion from './TaskSuggestion'

interface AddNewTaskProps {
    onAddNewTask: (event: KeyboardEvent<HTMLInputElement>) => Promise<void>
}
export interface ColourOption {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}
// export const colourOptions: readonly ColourOption[] = [
export const colourOptions: ColourOption[] = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' }
];

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
];
const suggestions = [ 'Buy milk on 21.08.2024', 'Read a book', 'Go for a walk' ]

const promiseOptions = (inputValue: string) =>
    new Promise<ColourOption[]>((resolve) => {
        setTimeout(() => {
            resolve(colourOptions);
        }, 1000);
    });

const AddNewTask: FC<AddNewTaskProps> = ({ onAddNewTask }) => {
    const { t } = useTranslation()
    const inputRef = useRef<HTMLInputElement>(null)



    const handleKeyDown = useCallback(async (e: KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement
        if (e.key === 'Enter' && input.value.trim() !== '') {
            input.disabled = true
            try {
                await onAddNewTask(e)
                input.value = ''
            } finally {
                input.disabled = false
                inputRef.current?.focus()
            }
        }
    }, [onAddNewTask])

    const askGpt = useCallback(() => {
        const random = Math.floor(Math.random() * suggestions.length)
        const oldValue = inputRef.current!.value
        console.log('oldValue', oldValue)
        inputRef.current!.value = suggestions[random]
        inputRef.current!.focus()
    }, [])

    return (
        <div className="row" style={{ marginTop: '10px' }}>
            <div className="col">
                <div className="input-group mb3">
                    <input
                        className="form-control"
                        type="text"
                        placeholder={t('new.task')}
                        onKeyDown={handleKeyDown}
                        // autoFocus={isBrowser}
                        ref={inputRef}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={askGpt}><FontAwesomeIcon icon={faWandSparkles}/></button>
                    </div>
                </div>
                <AsyncSelect cacheOptions defaultOptions loadOptions={promiseOptions} />
                <TaskSuggestion onAddNewTask={onAddNewTask}/>
            </div>
        </div>
    )
}

export default AddNewTask
