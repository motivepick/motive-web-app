// @ts-nocheck
import { DateTime } from 'luxon'
import React, { FC, useState } from 'react'
import { Draggable, DraggableProps } from '@hello-pangea/dnd'
import { useTranslation } from 'react-i18next'
import { Form, FormGroup } from 'reactstrap'
import { CheckMark } from '../common/task-item/task-header/check-mark'
import DueDate from '../common/task-item/task-header/due-date'
import { Title } from '../common/task-item/task-header/title'
import { TASK_DESCRIPTION_LIMIT, TASK_NAME_LIMIT } from '../../config'
import { ITaskNullable } from '../../models/appModel'
import { dateFromRelativeString } from '../../utils/date-from-relative-string'

import { CustomInput } from './CustomInput'

import './Task.css'

interface Props extends DraggableProps {
    id: number;
    name: string;
    description?: string;
    dueDate?: string;
    saveTask: (id: number, task: ITaskNullable) => void;
    onTaskClose: (id: number) => void;
    closed: boolean;
}

interface TaskItemProps {

}

const DUE_DATE_FORMAT = 'yyyy-MM-dd'

const isTaskToggle = (target: any) => {
    const tagName = target.tagName.toLowerCase()
    const className = target.className
    return ['div', 'form', 'small', 'del'].includes(tagName) && !className.includes('task-check-mark-element')
}

const TaskItem: FC<TaskItemProps> = props => {
    return ()
}

const Task: FC<Props> = props => {
    const { id, name, description, dueDate, isDraggable, index, saveTask, onTaskClose } = props
    const dueDateValue = dueDate ? DateTime.fromISO(dueDate) : null
    const [detailsShown, setDetailsShown] = useState(props.closed)
    const [closed, setClosed] = useState(false)
    const { t } = useTranslation()

    const handleTaskClose = async () => {
        setClosed(!closed)
        onTaskClose(id)
    }

    const handleTaskClick = ({ target }: React.MouseEvent<HTMLElement>) => {
        if (isTaskToggle(target)) {
            setDetailsShown(!detailsShown)
        }
    }

    const saveName = (name: string) => {
        // @ts-ignore
        const task = dateFromRelativeString({ name: name ? name.trim() : '' })
        saveTask(id, task)
        return task.name
    }

    const saveDescription = (description: string) => {
        const task = { description }
        saveTask(id, task)
        return task.description
    }

    const saveDate = (dueDate: string) => {
        const task = { dueDate: DateTime.fromISO(dueDate).endOf('day').toUTC() }
        saveTask(id, task)
        return task.dueDate
    }

    if (isDraggable) {
        return (
            <Draggable draggableId={id.toString()} index={index}>
                {(provided) => (
                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <div className="task-container">
                            <div className="task" onClick={handleTaskClick}>
                                <div className="task-header">
                                    <CheckMark toggled={closed} onToggle={handleTaskClose}/>
                                    <div className="task-body">
                                        <Title dimmedStyle={closed}>{name}</Title>
                                        <DueDate dimmedStyle={closed}>{dueDateValue}</DueDate>
                                    </div>
                                </div>

                                {detailsShown &&
                                    <Form className="task-form" onSubmit={e => e.preventDefault()}>
                                        <FormGroup>
                                            <CustomInput type="text" value={name} onSave={saveName} maxLength={TASK_NAME_LIMIT}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <CustomInput type="date" value={dueDateValue && dueDateValue.toFormat(DUE_DATE_FORMAT)}
                                                         onSave={saveDate} maxLength={DUE_DATE_FORMAT.length}/>
                                        </FormGroup>
                                        <FormGroup className="task-form-description">
                                            <CustomInput type="textarea" placeholder={t('task.description')} value={description}
                                                         onSave={saveDescription} maxLength={TASK_DESCRIPTION_LIMIT}/>
                                        </FormGroup>
                                    </Form>
                                }
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
        )
    } else {
        return (
            <div className="task-container">
                <div className="task" onClick={handleTaskClick}>
                    <div className="task-header">
                        <CheckMark toggled={closed} onToggle={handleTaskClose}/>
                        <div className="task-body">
                            <Title dimmedStyle={closed}>{name}</Title>
                            <DueDate dimmedStyle={closed}>{dueDateValue}</DueDate>
                        </div>
                    </div>

                    {detailsShown &&
                        <Form className="task-form" onSubmit={e => e.preventDefault()}>
                            <FormGroup>
                                <CustomInput type="text" value={name} onSave={saveName} maxLength={TASK_NAME_LIMIT}/>
                            </FormGroup>
                            <FormGroup>
                                <CustomInput type="date" value={dueDateValue && dueDateValue.toFormat(DUE_DATE_FORMAT)}
                                             onSave={saveDate} maxLength={DUE_DATE_FORMAT.length}/>
                            </FormGroup>
                            <FormGroup className="task-form-description">
                                <CustomInput type="textarea" placeholder={t('task.description')} value={description}
                                             onSave={saveDescription} maxLength={TASK_DESCRIPTION_LIMIT}/>
                            </FormGroup>
                        </Form>
                    }
                </div>
            </div>
        )
    }
}

export default Task
