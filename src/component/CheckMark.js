import React from 'react'

export const CheckMark = props => {
    const { closed } = props
    return (
        closed ? <div style={{ height: '24px' }}>
            <div className="check-mark">
                <div className="circle complete-circle"/>
                <div className="check-mark-stem-closed"/>
                <div className="check-mark-kick-closed"/>
            </div>
        </div> : <div className="circle incomplete-circle"/>
    )
}
