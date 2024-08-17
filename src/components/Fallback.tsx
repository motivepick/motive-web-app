import React, { FC } from 'react'
import Spinner from './common/Spinner'

const Fallback: FC = () =>
    <div className="container">
        <Spinner/>
    </div>

export default Fallback
