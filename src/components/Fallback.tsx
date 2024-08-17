import React, { FC } from 'react'
import Spinner from './common/Spinner'

const Fallback: FC = () =>
    <div className="container-xl">
        <Spinner/>
    </div>

export default Fallback
