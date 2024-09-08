import React, { FC, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import TaskInputWithSuggestion from './TaskInputWithSuggestion'

interface AddNewTaskProps {
    onAddNewTask: (event: KeyboardEvent<HTMLInputElement>) => Promise<void>
}

const AddNewTask: FC<AddNewTaskProps> = ({ onAddNewTask }) => {
    const { t } = useTranslation()
    return (
        <div className="row" style={{ marginTop: '10px' }}>
            <div className="col">
               <TaskInputWithSuggestion onSubmit={onAddNewTask} placeholder={t('new.task')} />
            </div>
        </div>
    )
}

export default AddNewTask
