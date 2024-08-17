import React, { MouseEventHandler } from 'react'

import './styles.css'

type CheckMarkProps = {
    onToggle: MouseEventHandler;
    toggled: boolean;
}

const ToggledCheckMark =
    <div style={{ height: '24px' }}>
        <div className="check-mark">
            <div className="task-check-mark-element circle complete-circle"/>
            <div className="task-check-mark-element check-mark-stem-closed"/>
            <div className="task-check-mark-element check-mark-kick-closed"/>
        </div>
    </div>

const UntoggledCheckMark = <div className="task-check-mark-element circle incomplete-circle"/>

export const CheckMark: React.FC<CheckMarkProps> = props => {
    const { onToggle, toggled } = props
    return (
        <button className="btn btn-link" onClick={onToggle}>
            {toggled ? ToggledCheckMark : UntoggledCheckMark}
        </button>
    )
}
