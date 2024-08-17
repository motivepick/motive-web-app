import React, { FC } from 'react'

const ScheduleHeader: FC<React.PropsWithChildren> = ({ children }) =>
    <div className="row" style={{ padding: '10px 4px', textTransform: 'uppercase', fontSize: '80%' }}>
        <div className="col-12" style={{ color: '#8E8E93' }}>{children}</div>
    </div>

export default ScheduleHeader
