import React, { MouseEventHandler, PropsWithChildren } from 'react'
import WithLinks from '../../../WithLinks'

import './styles.css'

type TitleProps = {
    onClick: MouseEventHandler;
    dimmedStyle: boolean;
}

const DimmedTitle: React.FC<PropsWithChildren<unknown>> = ({ children }) =>
    <div className={'dimmed'}>
        {<del><WithLinks>{children}</WithLinks></del>}
    </div>

const RegularTitle: React.FC<PropsWithChildren<unknown>> = ({ children }) =>
    <div>
        {<WithLinks>{children}</WithLinks>}
    </div>

export const Title: React.FC<PropsWithChildren<TitleProps>> = props => {
    const { onClick, dimmedStyle = false, children } = props
    return (
        <div onClick={onClick}>
            {dimmedStyle ? <DimmedTitle>{children}</DimmedTitle> : <RegularTitle>{children}</RegularTitle>}
        </div>
    )
}
