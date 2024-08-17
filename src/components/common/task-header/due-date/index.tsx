import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import './styles.css'
import { DateTimeMaybeValid } from 'luxon/src/datetime'

type Props = {
    dimmedStyle: boolean;
    value: DateTimeMaybeValid | null;
}

const classOf = (dueDate: DateTime | undefined, dimmedStyle: boolean): string => {
    if (dimmedStyle) return 'dimmed'
    if (dueDate && dueDate < DateTime.local().startOf('day')) return 'text-danger'
    if (dueDate?.hasSame(DateTime.local(), 'day')) return 'text-primary'
    return ''
}

const DueDate: FC<Props> = props => {
    const { dimmedStyle = false, value } = props
    const { t } = useTranslation()
    return value ? <small className={classOf(value, dimmedStyle)}>
        {t('dueDate', { date: value.toJSDate() })}
    </small> : null
}

export default DueDate
