import React, { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import './styles.css'

type Props = {
    dimmedStyle: boolean;
    children: ReactNode;
}

const classOf = (dueDate: DateTime | undefined, dimmedStyle: boolean): string => {
    if (dimmedStyle) return 'dimmed'
    if (dueDate && dueDate < DateTime.local().startOf('day')) return 'text-danger'
    if (dueDate?.hasSame(DateTime.local(), 'day')) return 'text-primary'
    return ''
}

const DueDate: FC<Props> = props => {
    const { dimmedStyle = false, children } = props
    const { t } = useTranslation()
    return children ? <small className={classOf(children as unknown as DateTime, dimmedStyle)}>
        {t('{{ date, DATE_SHORT_RELATIVE }}', { date: (children as unknown as DateTime).toJSDate() })}
    </small> : null
}

export default DueDate
