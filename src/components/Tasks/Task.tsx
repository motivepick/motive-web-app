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
import { DateTimeMaybeValid } from 'luxon/src/datetime'

const DUE_DATE_FORMAT = 'yyyy-MM-dd'

interface TaskItemProps {
    detailsShown: boolean
    name: string
    description?: string
    dueDateValue?: DateTimeMaybeValid
    closed: boolean
}

const TaskItem: FC<TaskItemProps> = props => {
    const { name, description, dueDateValue, closed, detailsShown, handleTaskClick, handleTaskClose, saveName, saveDescription, saveDate } = props
    const { t } = useTranslation()
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

interface DraggableWrapperProps {
    id: number
    index: number
    isDraggable: boolean
}

const DraggableWrapper: FC<DraggableWrapperProps> = ({ id, index, isDraggable, children }) =>
    isDraggable ? (
        <Draggable draggableId={id.toString()} index={index}>
            {(provided) => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    {children}
                </div>
            )}
        </Draggable>
    ) : children

const isTaskToggle = (target: any) => {
    const tagName = target.tagName.toLowerCase()
    const className = target.className
    return ['div', 'form', 'small', 'del'].includes(tagName) && !className.includes('task-check-mark-element')
}

interface Props extends DraggableProps {
    id: number;
    name: string;
    description?: string;
    dueDate?: string;
    closed: boolean
    saveTask: (id: number, task: ITaskNullable) => void;
    onTaskClose: (id: number) => void;
}

const Task: FC<Props> = props => {
    const { id, name, description, dueDate, isDraggable, index, saveTask, onTaskClose } = props
    const dueDateValue = dueDate ? DateTime.fromISO(dueDate) : null
    const [detailsShown, setDetailsShown] = useState(false)
    const [closed, setClosed] = useState(props.closed)

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

    return (
        <DraggableWrapper id={id} index={index} isDraggable={isDraggable}>
            <TaskItem
                name={name}
                description={description}
                dueDateValue={dueDateValue}
                closed={closed}
                detailsShown={detailsShown}
                handleTaskClick={handleTaskClick}
                handleTaskClose={handleTaskClose}
                saveName={saveName}
                saveDescription={saveDescription}
                saveDate={saveDate}
            />
        </DraggableWrapper>
    )
}

export default Task
