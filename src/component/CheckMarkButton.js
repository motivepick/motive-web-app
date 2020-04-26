import React from 'react'
import { Button } from 'reactstrap'

import { CheckMark } from './CheckMark'

export const CheckMarkButton = props => {
    const { onToggle, toggled } = props
    return (
        <Button color="link" onClick={onToggle}>
            <CheckMark closed={toggled}/>
        </Button>
    )
}
