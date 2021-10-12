import React, { useState } from 'react'

import { Col, Input, Row } from 'reactstrap'
import { isBrowser } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import { TASK_LIST } from '../../models/appModel'
import { handleDueDateOf } from '../../utils/taskUtils'
import { ICreateTaskRequest } from '../../models/redux/taskServiceModel'
import { useTasksStore } from '../../redux'

export const AddTask = () => {
    const { t } = useTranslation()
    const { createTask, setTaskList } = useTasksStore()
    const inputElement = React.useRef<HTMLInputElement>()

    const [value, setValue] = useState('')
    const [disabled, setDisabled] = useState(false)

    const onAddTask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = inputElement.current
        const name = value.trim()
        if (e.key === 'Enter' && name !== '') {
            try {
                setDisabled(true)
                const task = handleDueDateOf({ name }) as ICreateTaskRequest
                setTaskList(TASK_LIST.INBOX)
                await createTask(task)
                setValue('')
            } finally {
                setDisabled(false)
                input?.focus()
            }
        }
    }

    return (
        <Row style={{ marginTop: '10px' }}>
            <Col>
                <Input ref={inputElement}
                       type="text"
                       value={value}
                       onKeyPress={onAddTask}
                       onChange={e => setValue(e.target.value)}
                       disabled={disabled}
                       placeholder={t('new.task')}
                       autoFocus={isBrowser}/>
            </Col>
        </Row>
    )
}





