import React, { MouseEventHandler, PropsWithChildren } from 'react'
import WithLinks from '../../../WithLinks'

import './styles.css'

type TitleProps = {
    onClick: MouseEventHandler;
    dimmedStyle: boolean;
}

export const Title: React.FC<TitleProps> = props => {
    const { onClick, dimmedStyle = false, children } = props
    return (
        <div onClick={onClick}>
            <div className={dimmedStyle ? 'dimmed': ''}>
                <WithLinks>{children}</WithLinks>
            </div>
        </div>
    )
}
