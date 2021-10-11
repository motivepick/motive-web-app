// @ts-nocheck
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormGroup } from 'reactstrap'
import { TASK_DESCRIPTION_LIMIT, TASK_NAME_LIMIT } from '../../config'
import { ITaskNullable } from '../../models/appModel'
import { handleDueDateOf } from '../../utils/taskUtils'

import { CustomInput } from './CustomInput'

import './Task.css'

interface TaskDetailsProps {
    task: ITaskNullable;
    saveTask: (id: number, task: ITaskNullable) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, saveTask }) => {
    const { t } = useTranslation()

    const { id, name, description } = task
    const dueDate = task.dueDate ? moment(task.dueDate, moment.ISO_8601).format('YYYY-MM-DD') : null

    const saveName = (name: string) => {
        // @ts-ignore
        const updatedTask = handleDueDateOf({ name: name?.trim() ?? '' })
        saveTask(id, updatedTask)
        return updatedTask.name
    }

    const saveDescription = (description: string) => {
        const updatedTask = { description }
        saveTask(id, updatedTask)
        return updatedTask.description
    }

    const saveDate = (dueDate: string) => {
        const updatedTask = { dueDate: moment(dueDate, 'YYYY-MM-DD').endOf('day') }
        saveTask(id, updatedTask)
        return updatedTask.dueDate
    }

    return (
        <Form className="task-form" onSubmit={e => e.preventDefault()}>
            <FormGroup>
                <CustomInput type="text" value={name} onSave={saveName} maxLength={TASK_NAME_LIMIT}/>
            </FormGroup>
            <FormGroup>
                <CustomInput type="date" value={dueDate} onSave={saveDate}/>
            </FormGroup>
            <FormGroup className="task-form-description">
                <CustomInput type="textarea" value={description} onSave={saveDescription} maxLength={TASK_DESCRIPTION_LIMIT} placeholder={t('task.description')} />
            </FormGroup>
        </Form>
    )
}

export default TaskDetails
