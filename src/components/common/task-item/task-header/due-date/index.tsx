import React, { ReactNode } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import './styles.css'

type DueDateProps = {
    dimmedStyle: boolean;
    children: ReactNode;
}

const classOf = (dueDate: DateTime | undefined, dimmedStyle: boolean): string => {
    if (dimmedStyle) return 'dimmed'
    if (dueDate && dueDate < DateTime.local().startOf('day')) return 'text-danger'
    if (dueDate?.hasSame(DateTime.local(), 'day')) return 'text-primary'
    return ''
}

const DueDate: React.FC<DueDateProps & WithTranslation> = props => {
    const { dimmedStyle = false, children, t } = props

    return children
        ? <small className={classOf(children as DateTime, dimmedStyle)}>{t('{{ date, DATE_SHORT_RELATIVE }}', { date: (children as DateTime).toJSDate() })}</small>
        : null
}

export default withTranslation()(DueDate)