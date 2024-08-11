import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface ExpandedNavProps {
  onAllTasksClick?: () => void
}

const ExpandedNav: React.FC<ExpandedNavProps> = ({ onAllTasksClick }) => {
  const { t } = useTranslation()
  return (
    <Fragment>
      <li className="nav-item">
        {/* TODO: make active work again */}
        <Link to="/" className="nav-link" onClick={onAllTasksClick}>{t('allTasks')}</Link>
      </li>
      <li className="nav-item">
        <Link to="/schedule" className="nav-link">{t('schedule')}</Link>
      </li>
    </Fragment>
  )
}

export default ExpandedNav