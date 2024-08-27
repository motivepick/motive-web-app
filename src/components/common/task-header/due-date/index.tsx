import { faCalendar } from '@fortawesome/free-regular-svg-icons/faCalendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import './styles.css'
import { DateTimeMaybeValid } from 'luxon/src/datetime'

type Props = {
    dimmedStyle: boolean
    value?: DateTimeMaybeValid | null
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
    return value ? <span className={`small-gap ${classOf(value, dimmedStyle)}`}>
            <FontAwesomeIcon icon={faCalendar}/>{t('dueDate', { date: value.toISODate() })}
    </span> : null
}

export default DueDate
