import React, { MouseEventHandler } from 'react'
import { Button } from 'reactstrap'

import './styles.css'

type CheckMarkProps = {
    onToggle: MouseEventHandler;
    toggled: boolean;
}

const ToggledCheckMark =
    <div style={{ height: '24px' }}>
        <div className="check-mark">
            <div className="circle complete-circle"/>
            <div className="check-mark-stem-closed"/>
            <div className="check-mark-kick-closed"/>
        </div>
    </div>

const UntoggledCheckMark = <div className="circle incomplete-circle"/>

export const CheckMark: React.FC<CheckMarkProps> = ({ onToggle, toggled }) =>
    <Button color="link" onClick={onToggle}>
        {toggled ? ToggledCheckMark : UntoggledCheckMark}
    </Button>
