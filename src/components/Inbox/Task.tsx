import { DateTime } from 'luxon'
import React, { FC, FormEvent, MouseEvent, PropsWithChildren, useCallback, useState } from 'react'
import { Draggable, DraggableProps } from '@hello-pangea/dnd'
import { useTranslation } from 'react-i18next'
import { CheckMark } from '../common/task-header/check-mark'
import DueDate from '../common/task-header/due-date'
import { Title } from '../common/task-header/title'
import { TASK_DESCRIPTION_LIMIT, TASK_NAME_LIMIT } from '../../config'
import { UpdateTaskRequest } from '../../models/appModel'
import { extractDueDate } from '../../utils/extractDueDate'

import { CustomInput } from '../common/CustomInput'

import './Task.css'
import { DateTimeMaybeValid } from 'luxon/src/datetime'

const DUE_DATE_FORMAT = 'yyyy-MM-dd'

interface TaskItemProps {
    detailsShown: boolean
    name: string
    description?: string | null
    dueDate: DateTimeMaybeValid | null
    closed: boolean
    handleTaskClick: (e: MouseEvent<HTMLElement>) => void
    handleTaskClose: () => Promise<void>
    saveName: (name: string) => string
    saveDescription: (description: string) => string
    saveDate: (dueDate: string) => string
}

const TaskItem: FC<TaskItemProps> = props => {
    const { name, description, dueDate, closed, detailsShown, handleTaskClick, handleTaskClose, saveName, saveDescription, saveDate } = props
    const { t } = useTranslation()
    return (
        <div className="task-container">
            <div className="task" onClick={handleTaskClick}>
                <div className="task-header">
                    <CheckMark toggled={closed} onToggle={handleTaskClose}/>
                    <div className="task-body">
                        <Title dimmedStyle={closed}>{name}</Title>
                        <DueDate dimmedStyle={closed} value={dueDate}/>
                    </div>
                </div>

                {detailsShown &&
                    <form className="task-form" onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}>
                        <div className="mb-3">
                            <CustomInput type="text" value={name} onSave={saveName} maxLength={TASK_NAME_LIMIT}/>
                        </div>
                        <div className="mb-3">
                            <CustomInput type="date" value={dueDate && dueDate.toFormat(DUE_DATE_FORMAT)} onSave={saveDate} maxLength={DUE_DATE_FORMAT.length}/>
                        </div>
                        <div className="mb-3 task-form-description">
                            <CustomInput
                                type="textarea"
                                placeholder={t('task.description')}
                                value={description}
                                onSave={saveDescription}
                                maxLength={TASK_DESCRIPTION_LIMIT}
                            />
                        </div>
                    </form>
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

const DraggableWrapper: FC<PropsWithChildren<DraggableWrapperProps>> = ({ id, index, isDraggable, children }) =>
    isDraggable ? (
        <Draggable draggableId={id.toString()} index={index}>
            {(provided) => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    {children}
                </div>
            )}
        </Draggable>
    ) : <>{children}</>

const isTaskToggle = (target: any) => {
    const tagName = target.tagName.toLowerCase()
    const className = target.className
    return ['div', 'form', 'small', 'del'].includes(tagName) && !className.includes('task-check-mark-element')
}

interface Props extends DraggableProps {
    id: number
    name: string
    description?: string | null
    dueDate?: string | null
    closed: boolean
    isDraggable: boolean
    saveTask: (id: number, task: UpdateTaskRequest) => void
    onTaskClose: (id: number) => void
}

const Task: FC<Props> = props => {
    const { id, name, description, dueDate, isDraggable, index, saveTask, onTaskClose } = props
    const [detailsShown, setDetailsShown] = useState(false)
    const [closed, setClosed] = useState(props.closed)

    const handleTaskClose = useCallback(async () => {
        setClosed(closed => !closed)
        onTaskClose(id)
    }, [id, onTaskClose])

    const handleTaskClick = useCallback((e: MouseEvent<HTMLElement>) => {
        if (isTaskToggle(e.target)) {
            setDetailsShown(detailsShown => !detailsShown)
        }
    }, [])

    const saveName = useCallback((name: string) => {
        const task = extractDueDate(name ? name.trim() : '')
        saveTask(id, task)
        return task.name
    }, [id, saveTask])

    const saveDescription = useCallback((description: string) => {
        const task: UpdateTaskRequest = { description }
        saveTask(id, task)
        return task.description ?? ''
    }, [id, saveTask])

    const saveDate = useCallback((dueDate: string) => {
        const task: UpdateTaskRequest = { dueDate: dueDate ? DateTime.fromISO(dueDate).endOf('day').toUTC() : null, deleteDueDate: !dueDate }
        saveTask(id, task)
        return task.dueDate?.toFormat('yyyy-MM-dd') ?? ''
    }, [id, saveTask])

    return (
        <DraggableWrapper id={id} index={index} isDraggable={isDraggable}>
            <TaskItem
                name={name}
                description={description}
                dueDate={dueDate ? DateTime.fromISO(dueDate) : null}
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
