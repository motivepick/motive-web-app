// @ts-nocheck
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

const TaskSuggestion: FC = () => {
    const asyncRef = useRef<SelectInstance<ColourOption> | null>(null)
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const focusAsync = () => {
        console.log(asyncRef);
        asyncRef.current?.focus();
    };
    const blurAsync = () => {
        asyncRef.current?.blur();
    };

    const handleDropdownIndicatorClick = () => {
        setMenuIsOpen((prev) => !prev);
    };

    const handleButtonClick = () => {
        setIsLoading(true);
        setMenuIsOpen(true);
    };

    // https://github.com/JedWatson/react-select/discussions/4379
    // https://stackoverflow.com/questions/54403806/react-select-how-to-keep-default-behavior-of-menu-open-close-plus-add-to-open-me
    return (
        <>
            <AsyncSelect components={{ DropdownIndicator }}
                         cacheOptions
                         defaultOptions
                         loadOptions={promiseOptions}
                         isLoading={isLoading}
                         ref={asyncRef}
                         isClearable
                         menuIsOpen={menuIsOpen}
                         // onMenuOpen={() => setMenuIsOpen(true)}
                         onMenuClose={() => setMenuIsOpen(false)}
                         onDropdownIndicatorClick={handleDropdownIndicatorClick}
            />
            <button onClick={focusAsync} id="cypress-single__clearable-checkbox">
                Focus
            </button>
            <button onClick={blurAsync} id="cypress-single__clearable-checkbox">
                Blur
            </button>
        </>
    )
}

export default TaskSuggestion
