import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

const Spinner: FC = () => {
    const { t } = useTranslation()
    return (
        <div className="row" style={{ marginTop: '150px', marginBottom: '10px' }}>
            <div className="col text-center">
                <div className="spinner-grow text-secondary" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                </div>
            </div>
        </div>
    )
}

export default Spinner
