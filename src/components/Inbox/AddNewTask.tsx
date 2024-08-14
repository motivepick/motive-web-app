import React, { FC, KeyboardEvent, useCallback, useRef } from 'react'
import { isBrowser } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import { Col, Input, Row } from 'reactstrap'

interface AddNewTaskProps {
    onAddNewTask: (event: KeyboardEvent<HTMLInputElement>) => void
}

const AddNewTask: FC<AddNewTaskProps> = ({ onAddNewTask }) => {
    const { t } = useTranslation()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleKeyPress = useCallback(async (e: KeyboardEvent<HTMLInputElement>) => {
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
        <Row style={{ marginTop: '10px' }}>
            <Col>
                <Input
                    type="text"
                    placeholder={t('new.task')}
                    onKeyPress={handleKeyPress}
                    autoFocus={isBrowser}
                    innerRef={inputRef}
                />
            </Col>
        </Row>
    )
}

export default AddNewTask
