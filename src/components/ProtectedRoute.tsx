import React, { FC, ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

interface Props {
    isAllowed: boolean,
    redirectPath: string,
    children?: ReactElement
}

const ProtectedRoute: FC<Props> = ({ isAllowed, redirectPath, children }: Props) =>
    isAllowed ? children || <Outlet/> : <Navigate to={redirectPath} replace/>

export default ProtectedRoute
