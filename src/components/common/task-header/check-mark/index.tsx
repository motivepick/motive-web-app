import { faCircle } from '@fortawesome/free-regular-svg-icons/faCircle'
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons/faCircleCheck'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { MouseEventHandler } from 'react'

import './styles.css'

type CheckMarkProps = {
    onToggle: MouseEventHandler;
    toggled: boolean;
}

export const CheckMark: React.FC<CheckMarkProps> = props => {
    const { onToggle, toggled } = props
    return (
        <button className={`btn btn-link ${toggled ? 'complete-circle' : 'incomplete-circle'}`} onClick={onToggle} style={{ paddingLeft: '9px' }}>
            <FontAwesomeIcon icon={toggled ? faCircleCheck : faCircle} size="xl" data-testid="check-mark-icon"/>
        </button>
    )
}
