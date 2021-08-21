import React, { FormEvent } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Col, Form, FormGroup, Row } from 'reactstrap'
import { TASK_DESCRIPTION_LIMIT, TASK_NAME_LIMIT } from '../../../const'
import { ITask } from '../../../models'
import { CustomInput } from '../../../Tasks/CustomInput'

import './styles.css'

interface TaskFormProps extends WithTranslation {
    task?: ITask;
    saveName?: (name: string) => void;
    saveDescription?: (description: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = props => {
    const { task, saveName, saveDescription, t } = props
    return (
        <Row className="detailed">
            <Col>
                <Form className="task-form" onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}>
                    <FormGroup>
                        <CustomInput type="text" value={task?.name} dueDate={task?.dueDate} onSave={saveName} maxLength={TASK_NAME_LIMIT}/>
                    </FormGroup>
                    <FormGroup className="task-form-description">
                        <CustomInput type="textarea" placeholder={t('task.description')} value={task?.description}
                                     onSave={saveDescription} maxLength={TASK_DESCRIPTION_LIMIT}/>
                    </FormGroup>
                </Form>
            </Col>
        </Row>
    )
}

export default withTranslation()(TaskForm)
