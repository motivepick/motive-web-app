import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

const NoTasksImage: FC = () => {
    const { t } = useTranslation()
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <img src={t('noTasksImg')} className="d-inline-block align-center" alt={t('noTasksAlt')}/>
        </div>
    )
}

export default NoTasksImage