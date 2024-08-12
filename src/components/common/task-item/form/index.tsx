import React, { FC, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Form, FormGroup, Row } from 'reactstrap'
import { TASK_DESCRIPTION_LIMIT, TASK_NAME_LIMIT } from '../../../../config'
import { ITask } from '../../../../models/appModel'
import { CustomInput } from '../../.././Inbox/CustomInput'

import './styles.css'

interface Props {
    task?: ITask;
    saveName: (name: string) => string;
    saveDescription: (description: string) => string;
}

const TaskForm: FC<Props> = props => {
    const { task, saveName, saveDescription } = props
    const { t } = useTranslation()
    return (
        <Row className="detailed">
            <Col>
                <Form className="task-form" onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}>
                    <FormGroup>
                        <CustomInput type="text" value={task?.name} onSave={saveName} maxLength={TASK_NAME_LIMIT}/>
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

export default TaskForm
