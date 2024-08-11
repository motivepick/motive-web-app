// @ts-ignore
import { History } from 'history'
import React, { Fragment, PureComponent } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { history } from '../../index'

interface ExpandedNavProps extends WithTranslation {
    history: History;
    onAllTasksClick?: () => void
}

class ExpandedNav extends PureComponent<ExpandedNavProps> {

    render() {
        const { onAllTasksClick, t } = this.props
        return (
          <Fragment>
              {/* TODO: make active work again */}
              <li className="nav-item">
                  {/* eslint-disable-next-line */}
                  <a className="nav-link" onClick={onAllTasksClick || this.handleAllTasksClick} style={{ cursor: 'pointer' }}>
                      {t('allTasks')}
                  </a>
              </li>
              <li className="nav-item">
                  <Link className="nav-link" to="/schedule">
                      {t('schedule')}
                  </Link>
              </li>
          </Fragment>
        )
    }

    handleAllTasksClick = () => {
        history.push('/')
    }
}

export default withTranslation()(ExpandedNav)