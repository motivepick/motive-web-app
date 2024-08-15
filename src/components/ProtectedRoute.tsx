import React, { FC, PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

interface Props {
    isAllowed: boolean,
    redirectPath: string
}

const ProtectedRoute: FC<PropsWithChildren<Props>> = ({ isAllowed, redirectPath, children }) =>
    isAllowed ? <>{children}</> || <Outlet/> : <Navigate to={redirectPath} replace/>

export default ProtectedRoute
