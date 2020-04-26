import React from 'react'

import './styles.css'
import { format } from '../../../../utils/dateFormat'

const classOf = (dueDate, dimmedStyle) => {
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

export const DueDate = props => {
    const { onClick, dimmedStyle = false, children } = props

    if(!children) return null
    return <small onClick={onClick} className={classOf(children, dimmedStyle)}>{format(children)}</small>
}
