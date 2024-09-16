import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
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
// const suggestions = [ 'Buy milk on 21.08.2024', 'Read a book', 'Go for a walk' ]
const suggestions = [ 'suggestion1', 'suggestion2', 'suggestion3', 'suggestion4', 'suggestion5']

const promiseOptions = (inputValue: string) =>
    new Promise<ColourOption[]>((resolve) => {
        setTimeout(() => {
            resolve(colourOptions);
        }, 1000);
    });

const AddNewTask: FC<AddNewTaskProps> = ({ onAddNewTask }) => {
    const { t } = useTranslation()
    const inputRef = useRef<HTMLInputElement>(null)
    const [gptSuggestions, setGptSuggestions] = React.useState<string[]>([])
    const [gptAsked, setGptAsked] = React.useState(false);
    const [gptIndex, setGptIndex] = React.useState(-1);

    const submitTask = useCallback(async (e: KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement
        if (e.key === 'Enter' && input.value.trim() !== '') {
            input.disabled = true
            setGptAsked(false)
            try {
                await onAddNewTask(e)
                input.value = ''
            } finally {
                input.disabled = false
                inputRef.current?.focus()
            }
        }
    }, [inputRef, onAddNewTask])

    const askGpt = useCallback(() => {
        const updatedGptSuggestions = gptSuggestions
        let updatedGptIndex = gptIndex
        if (!gptAsked && inputRef.current?.value) {
            console.log('INTIAL VALUE SAVED')
            console.log('inputRef.current!.value', inputRef.current!.value)
            updatedGptSuggestions.push(inputRef.current!.value)
            updatedGptIndex += 1
        }
        setGptAsked(true);
        const newSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
        inputRef.current!.value = newSuggestion
        inputRef.current!.focus()
        updatedGptSuggestions.push(newSuggestion)
        updatedGptIndex += 1
        setGptSuggestions(updatedGptSuggestions)
        setGptIndex(updatedGptIndex)
    }, [inputRef, gptSuggestions, gptIndex, setGptSuggestions, setGptAsked, setGptIndex])

    const onGoBack = useCallback(() => {
        console.log('onGoBack')
        console.log('gptIndex before', gptIndex, gptSuggestions[gptIndex])
        const prevPageIndex = gptIndex - 1 < 0 ? gptIndex : gptIndex - 1
        const prevPage = gptSuggestions[prevPageIndex]
        console.log('gptIndex after', prevPageIndex, prevPage)

        setGptIndex(gptIndex)
        inputRef.current!.value = prevPage
    }, [inputRef, gptSuggestions, gptIndex, setGptIndex])

    const onGoForward = useCallback(() => {
        console.log('onGoForward')
        const nextPageIndex = gptIndex + 1 > gptSuggestions.length ? gptIndex : gptIndex + 1
        const nextPage = gptSuggestions[nextPageIndex]
        setGptIndex(gptIndex)
        inputRef.current!.value = nextPage
    }, [inputRef, gptSuggestions, gptIndex, setGptIndex])

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(`onChange ${e.target.value}`)
        console.log(`onChange gptSuggestions ${gptSuggestions}`)
    }, [])

    console.log('initial indexes', gptIndex, gptSuggestions.length)

    return (
        <div className="row" style={{ marginTop: '10px' }}>
            <div className="col">
                <div className="input-group mb3">
                    {gptIndex > 0 ? <button className="btn btn-outline-secondary" type="button" onClick={onGoBack}><FontAwesomeIcon
                        icon={faChevronLeft}/></button> : null}
                    <input
                        className="form-control"
                        type="text"
                        placeholder={t('new.task')}
                        onKeyDown={submitTask}
                        onChange={onChange}
                        autoFocus={isBrowser}
                        ref={inputRef}
                    />
                    {gptIndex < gptSuggestions.length - 1 ?
                        <button className="btn btn-outline-secondary" type="button" onClick={onGoForward}><FontAwesomeIcon icon={faChevronRight}/></button>
                        : null}
                    {gptIndex === gptSuggestions.length - 1 ?
                        <button className="btn btn-outline-secondary" type="button" onClick={askGpt}><FontAwesomeIcon icon={faWandSparkles}/></button>
                        : null}
                </div>
            </div>
        </div>
    )
}

export default AddNewTask
