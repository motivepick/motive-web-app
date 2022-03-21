import { Moment } from 'moment'
import React, { ReactNode } from 'react'
import { format } from '../../../../../utils/dateFormat'

import './styles.css'

type DueDateProps = {
    dimmedStyle: boolean;
    children: ReactNode;
}

const classOf = (dueDate: Moment, dimmedStyle: boolean): string => {
    if (dimmedStyle) {
        return 'dimmed'
    } else if (dueDate) {
        const now = new Date()
        if (dueDate.isBefore(now, 'day')) {
            return 'text-danger'
        } else if (dueDate.isSame(now, 'day')) {
            return 'text-primary'
        } else {
            return ''
        }
    } else {
        return ''
    }
}

export const DueDate: React.FC<DueDateProps> = props => {
    const { dimmedStyle = false, children } = props

    return children
        ? <small className={classOf(children as Moment, dimmedStyle)}>{format(children as Moment)}</small>
        : null
}
