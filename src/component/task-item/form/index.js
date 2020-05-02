import React from 'react'
import { Col, Form, FormGroup, Row } from 'reactstrap'
import { CustomInput } from '../../../Tasks/CustomInput'
import { TASK_DESCRIPTION_LIMIT, TASK_NAME_LIMIT } from '../../../const'

import './styles.css'
import { translate } from 'react-i18next'

const TaskForm = props => {
    const { task, saveName, saveDescription, t } = props
    return (
        <Row className="detailed">
            <Col>
                <Form className="task-form" onSubmit={e => e.preventDefault()}>
                    <FormGroup>
                        <CustomInput type="text" value={task.name} dueDate={task.dueDate} onSave={saveName} maxLength={TASK_NAME_LIMIT}/>
                    </FormGroup>
                    <FormGroup className="task-form-description">
                        <CustomInput type="textarea" placeholder={t('task.description')} value={task.description}
                            onSave={saveDescription} maxLength={TASK_DESCRIPTION_LIMIT}/>
                    </FormGroup>
                </Form>
            </Col>
        </Row>
    )
}

export default translate()(TaskForm)
