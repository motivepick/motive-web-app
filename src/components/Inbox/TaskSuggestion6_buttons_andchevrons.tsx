// @ts-nocheck
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faWandSparkles } from '@fortawesome/free-solid-svg-icons/faWandSparkles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, KeyboardEvent, useCallback, useRef, useState } from 'react'
import { isBrowser } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import AsyncSelect, { useAsync } from 'react-select/async';
import Select, { components, DropdownIndicatorProps, SelectInstance } from 'react-select'

export interface ColourOption {
    readonly value: string;
    readonly label: string;
}
// export const colourOptions: readonly ColourOption[] = [
export const colourOptions: ColourOption[] = [
    { value: 'Buy milk on 21.08.2024', label: 'Buy milk on 21.08.2024' },
    { value: 'Read a book', label: 'Read a book' },
    { value: 'Go for a walk', label: 'Purple' }
];

const promiseOptions = (inputValue: string) => {
    return new Promise<ColourOption[]>((resolve) => {
        setTimeout(() => {
            resolve(colourOptions)
        }, 1200)
    })
};

const DropdownIndicator = (props: DropdownIndicatorProps<any, true>) => {
    const { selectProps } = props;
    return (
        <components.DropdownIndicator {...props}>
            <div onClick={selectProps.onDropdownIndicatorClick}>
                <FontAwesomeIcon icon={faWandSparkles}/>
            </div>
        </components.DropdownIndicator>
    );
};

interface AddNewTaskProps {
    onAddNewTask: (event: KeyboardEvent<HTMLInputElement>) => Promise<void>
}

const TaskSuggestion: FC<AddNewTaskProps> = ({ onAddNewTask }) => {
    const { t } = useTranslation()
    const asyncRef = useRef<SelectInstance<ColourOption> | null>(null)

    const handleKeyDown = useCallback(async (e: KeyboardEvent<any>) => {
        console.log(e)
        const input = e.target
        // const input = e.target as HTMLInputElement

        console.log(e.target);
        console.log('asyncRef.current.=' + asyncRef.current?.getOptionValue());
        console.log('asyncRef.current.2=' + asyncRef.current);
        console.log('asyncRef.current3.=' + asyncRef);
        console.log(asyncRef);
        const selectedOption = asyncRef.current?.state;
        console.log('Selected option:', selectedOption);


        console.log('input=' + input?.value)
        // selectRef.current.state.focusedOptionId

        if (e.key === 'Enter' && input.value.trim() !== '') {
            console.log('Enter key pressed')
            input.disabled = true
            try {
                await onAddNewTask(e)
                input.value = ''
            } finally {
                input.disabled = false
                asyncRef.current?.focus()
            }
        }
    }, [asyncRef, onAddNewTask])

    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuggestionRequested, setIsSuggestionRequested] = useState<boolean>(false);

    const mapResponseToValuesAndLabels = (data) => ({
        value: data.id,
        label: data.name
    });

    const getASuggestion = useCallback(async (value) => {
        if (!isSuggestionRequested) return []
        await new Promise(r => setTimeout(r, 5000))
        const data = await fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((response) => response.map(mapResponseToValuesAndLabels))
            .then((final) =>
                final.filter((i) => i.label.toLowerCase().includes(value.toLowerCase()))
            )

        return data
    }, [])


    const [input, setInput] = useState('');


    // https://github.com/JedWatson/react-select/discussions/4379
    // https://stackoverflow.com/questions/54403806/react-select-how-to-keep-default-behavior-of-menu-open-close-plus-add-to-open-me
    return (
        <>
            <p>Task suggestion V1</p>
            <AsyncSelect
                components={{ DropdownIndicator }}
                cacheOptions
                loadOptions={getASuggestion}
                inputValue={input}
                onInputChange={(data, changeType) => {
                    console.log(`onInputChange type=${changeType.action}; data=${data}`);
                    console.log(changeType)
                    if (changeType.action === 'input-change') setInput(data);
                }}
                onChange={(data, changeType) => {
                    console.log(`onChange type=${changeType.action}; data=${data}`);
                    console.log(changeType)
                }}
                placeholder={t('new.task')}
                autoFocus={isBrowser}
                onKeyDown={handleKeyDown}
                onDropdownIndicatorClick={() => setIsSuggestionRequested(!isSuggestionRequested)}
            />
            <>
                <div className="input-group mb-3">
                    <button className="btn btn-outline-secondary" type="button">Button</button>
                    <button className="btn btn-outline-secondary" type="button">Button</button>
                    <input type="text" className="form-control" placeholder=""
                           aria-label="Example text with two button addons"/>
                </div>

                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Recipient's username"
                           aria-label="Recipient's username with two button addons"/>
                    <button className="btn btn-outline-secondary" type="button">Button</button>
                    <button className="btn btn-outline-secondary" type="button">Button</button>
                </div>
                <div className="input-group">
                    <button className="btn btn-outline-secondary" type="button">Button</button>
                    <input type="text" className="form-control" placeholder="Recipient's username"
                           aria-label="Recipient's username with two button addons"/>
                    <button className="btn btn-outline-secondary" type="button">Button</button>
                </div>
                <div className="input-group">
                    <button className="btn btn-outline-secondary" type="button"><FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
                    <input type="text" className="form-control" placeholder="Recipient's username"
                           aria-label="Recipient's username with two button addons"/>
                    <button className="btn btn-outline-secondary" type="button"><FontAwesomeIcon icon={faChevronRight}/>
                    </button>
                </div>

                <div className="input-group">
                    <button className="btn btn-outline-secondary" type="button"><FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
                    <input type="text" className="form-control" placeholder="Recipient's username"
                           aria-label="Recipient's username with two button addons"/>
                    <button className="btn btn-outline-secondary" type="button"><FontAwesomeIcon icon={faChevronRight}/>
                    </button>
                    <button className="btn btn-outline-secondary" type="button"><FontAwesomeIcon icon={faWandSparkles}/>
                    </button>
                </div>
            </>
        </>
    )
}

export default TaskSuggestion
