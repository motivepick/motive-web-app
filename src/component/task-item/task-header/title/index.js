import React from 'react'

import './styles.css'
import WithLinks from '../../../WithLinks'

export const Title = props => {
    const { onClick, dimmedStyle = false, children } = props
    return (
        <div onClick={onClick} className={dimmedStyle ? 'dimmed' : ''}>
            {dimmedStyle ? <del><WithLinks>{children}</WithLinks></del> : <WithLinks>{children}</WithLinks>}
        </div>
    )
}
