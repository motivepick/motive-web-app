import React, { PropsWithChildren } from 'react'
import './styles.css'
import WithLinks from '../../WithLinks'

type TitleProps = {
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
    const { dimmedStyle = false, children } = props
    return dimmedStyle ? <DimmedTitle>{children}</DimmedTitle> : <RegularTitle>{children}</RegularTitle>
}
