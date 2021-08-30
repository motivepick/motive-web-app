import React, { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Form, FormGroup, Row } from 'reactstrap'
import { TASK_DESCRIPTION_LIMIT, TASK_NAME_LIMIT } from '../../../../config'
import { ITask } from '../../../../models/appModel'
import { CustomInput } from '../../../Tasks/CustomInput'

import './styles.css'

interface TaskFormProps {
    task?: ITask;
    saveName: (name: string) => string;
    saveDescription: (description: string) => string;
}

const TaskForm: React.FC<TaskFormProps> = props => {
    const { task, saveName, saveDescription } = props
    const { t } = useTranslation()
    return (
        <Row className="detailed">
            <Col>
                <Form className="task-form" onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}>
                    <FormGroup>
                        <CustomInput
                            type="text"
                            value={task?.name}
                            onSave={saveName}
                            maxLength={TASK_NAME_LIMIT}/>
                    </FormGroup>
                    <FormGroup className="task-form-description">
                        <CustomInput
                            type="textarea"
                            value={task?.description}
                            onSave={saveDescription}
                            maxLength={TASK_DESCRIPTION_LIMIT}
                            placeholder={t('task.description')}/>
                    </FormGroup>
                </Form>
            </Col>
        </Row>
    )
}

export default TaskForm
