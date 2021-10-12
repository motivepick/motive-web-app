import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormGroup } from 'reactstrap'
import { TASK_DESCRIPTION_LIMIT, TASK_NAME_LIMIT } from '../../../config'
import { ITaskNullable } from '../../../models/appModel'
import { handleDueDateOf } from '../../../utils/taskUtils'

import { CustomInput } from '../CustomInput'

import './Task.css'
import { useTasksStore } from '../../../redux'
import { IUpdateTaskRequest } from '../../../models/redux/taskServiceModel'

interface TaskDetailsProps {
    task: ITaskNullable;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
    const { t } = useTranslation()
    const { updateTask } = useTasksStore()

    const { id, name, description } = task
    const dueDate = task.dueDate ? moment(task.dueDate, moment.ISO_8601).format('YYYY-MM-DD') : null

    const saveName = (name: string) => {
        const updatedTask = handleDueDateOf({ name: name?.trim() ?? '' }) as IUpdateTaskRequest
        updateTask(id, updatedTask)
        return updatedTask.name || ''
    }

    const saveDescription = (description: string) => {
        const updatedTask = { description }
        updateTask(id, updatedTask)
        return updatedTask.description || ''
    }

    const saveDate = (dueDate: string) => {
        const updatedTask = { dueDate: moment(dueDate, 'YYYY-MM-DD').endOf('day') }
        updateTask(id, updatedTask)
        return updatedTask.dueDate.format() || ''
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
                <CustomInput type="textarea" value={description} onSave={saveDescription}
                             maxLength={TASK_DESCRIPTION_LIMIT} placeholder={t('task.description')}/>
            </FormGroup>
        </Form>
    )
}

export default TaskDetails
