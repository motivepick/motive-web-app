import React, { FC, PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

interface Props {
    isAllowed: boolean,
    redirectPath: string
}

const ProtectedRoute: FC<PropsWithChildren<Props>> = ({ isAllowed, redirectPath, children }) =>
    isAllowed ? <>{children}</> : <Navigate to={redirectPath} replace/>

export default ProtectedRoute
