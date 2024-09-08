import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faWandSparkles } from '@fortawesome/free-solid-svg-icons/faWandSparkles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, KeyboardEvent, useCallback, useRef } from 'react'
import { isBrowser } from 'react-device-detect'
import { useRephraseTaskMutation } from '../../redux/api'

interface TaskInputWithSuggestionProps {
    placeholder: string,
    onSubmit: (event: KeyboardEvent<HTMLInputElement>) => Promise<void>
}

const TaskInputWithSuggestion: FC<TaskInputWithSuggestionProps> = ({ onSubmit, placeholder }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [gptSuggestions, setGptSuggestions] = React.useState<string[]>([])
    const [gptAsked, setGptAsked] = React.useState(false)
    const [gptIndex, setGptIndex] = React.useState(-1)
    const [isLoading, setIsLoading] = React.useState(false)
    const [rephraseTask] = useRephraseTaskMutation();

    const submitTask = useCallback(async (e: KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement
        if (e.key === 'Enter' && input.value.trim() !== '') {
            input.disabled = true
            setGptAsked(false)
            setGptSuggestions([])
            setGptIndex(-1)
            try {
                await onSubmit(e)
                input.value = ''
            } finally {
                input.disabled = false
                inputRef.current?.focus()
            }
        }
    }, [inputRef, onSubmit, setGptAsked, setGptIndex, setGptSuggestions])

    const askGpt = useCallback(async () => {
        const updatedGptSuggestions = [...gptSuggestions]
        let updatedGptIndex = 0
        if (!gptAsked && inputRef.current?.value) {
            updatedGptIndex += 1
            updatedGptSuggestions.push(inputRef.current!.value)
        }
        if (!gptAsked && !inputRef.current?.value) return
        setIsLoading(true)
        const newSuggestion = (await rephraseTask(updatedGptSuggestions[0]).unwrap()).rephrased
        setGptAsked(true)
        setIsLoading(false)
        inputRef.current!.value = newSuggestion
        inputRef.current!.focus()
        updatedGptIndex += 1
        updatedGptSuggestions.push(newSuggestion)
        setGptSuggestions(updatedGptSuggestions)
        setGptIndex(gptIndex + updatedGptIndex)
    }, [inputRef, gptSuggestions, gptIndex, setGptSuggestions, setGptAsked, setGptIndex, setIsLoading, rephraseTask])

    const onGoBack = useCallback(() => {
        const prevPageIndex = gptIndex - 1 < 0 ? 0 : gptIndex - 1
        const prevPage = gptSuggestions[prevPageIndex]
        setGptIndex(prevPageIndex)
        inputRef.current!.value = prevPage
    }, [inputRef, gptSuggestions, gptIndex, setGptIndex])

    const onGoForward = useCallback(() => {
        const nextPageIndex = gptIndex + 1 > gptSuggestions.length ? gptIndex : gptIndex + 1
        const nextPage = gptSuggestions[nextPageIndex]
        setGptIndex(nextPageIndex)
        inputRef.current!.value = nextPage
    }, [inputRef, gptSuggestions, gptIndex, setGptIndex])

    return (
        <div className="input-group mb3">
            {gptIndex > 0 &&
                <button className="btn btn-outline-secondary" type="button" onClick={onGoBack}>
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </button>}
            <input
                className="form-control"
                type="text"
                placeholder={placeholder}
                onKeyDown={submitTask}
                autoFocus={isBrowser}
                ref={inputRef}
            />
            {gptIndex < gptSuggestions.length - 1 &&
                <button className="btn btn-outline-secondary" type="button" onClick={onGoForward}>
                    <FontAwesomeIcon icon={faChevronRight}/>
                </button>}
            {gptIndex === gptSuggestions.length - 1 &&
                <button className="btn btn-outline-secondary" type="button" onClick={askGpt}>
                    {isLoading &&
                        <span>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: '8px' }} ></span>
                            <span className="visually-hidden">Loading...</span>
                        </span>
                    }
                    <FontAwesomeIcon icon={faWandSparkles}/>
                </button>}
        </div>
    )
}

export default TaskInputWithSuggestion
