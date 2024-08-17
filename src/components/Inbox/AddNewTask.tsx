import React, { FC, KeyboardEvent, useCallback, useRef } from 'react'
import { isBrowser } from 'react-device-detect'
import { useTranslation } from 'react-i18next'

interface AddNewTaskProps {
    onAddNewTask: (event: KeyboardEvent<HTMLInputElement>) => Promise<void>
}

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

    return (
        <div className="row" style={{ marginTop: '10px' }}>
            <div className="col">
                <input
                    className="form-control"
                    type="text"
                    placeholder={t('new.task')}
                    onKeyDown={handleKeyDown}
                    autoFocus={isBrowser}
                    ref={inputRef}
                />
            </div>
        </div>
    )
}

export default AddNewTask
