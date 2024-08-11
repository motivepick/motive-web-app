import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

interface ExpandedNavProps {
  onAllTasksClick?: () => void
}

const ExpandedNav: React.FC<ExpandedNavProps> = ({ onAllTasksClick }) => {
  const { t } = useTranslation()
  return (
      <Fragment>
          <li className="nav-item">
              <NavLink exact to="/" className="nav-link" onClick={onAllTasksClick}>{t('allTasks')}</NavLink>
          </li>
          <li className="nav-item">
              <NavLink to="/schedule" className="nav-link">{t('schedule')}</NavLink>
          </li>
      </Fragment>
  )
}

export default ExpandedNav