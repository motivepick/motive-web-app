import React, { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { API_URL, FACEBOOK_AUTH_URL, VK_AUTH_URL } from '../../config'

interface DropdownNavProps {
    isTemporaryUserLoggedIn: boolean
}

const DropdownNav: React.FC<DropdownNavProps> = ({ isTemporaryUserLoggedIn }) => {
    const { t } = useTranslation()

    const handleVkLogin = useCallback(() => window.location.href = VK_AUTH_URL, [])
    const handleFacebookLogin = useCallback(() => window.location.href = FACEBOOK_AUTH_URL, [])
    const handleLogout = useCallback(() => window.location.href = `${API_URL}/logout`, [])

    return <UncontrolledDropdown>
      <DropdownToggle nav>
        <i className="fa fa-bars"/>
      </DropdownToggle>
      <DropdownMenu right>
        {isTemporaryUserLoggedIn &&
          <Fragment>
            <DropdownItem onClick={handleVkLogin}>
              <i className="fa fa-vk" style={{ marginRight: '0.1em' }}/> {t('login.vk')}
            </DropdownItem>
            <DropdownItem onClick={handleFacebookLogin}>
              <i className="fa fa-facebook-square" style={{ marginRight: '0.1em' }}/> {t('login.facebook')}
            </DropdownItem>
          </Fragment>}
        <DropdownItem className={isTemporaryUserLoggedIn ? 'text-danger' : ''} onClick={handleLogout}>
          <i className="fa fa-sign-out" style={{ marginRight: '0.3em' }}/>
          {isTemporaryUserLoggedIn ? t('deleteTasksAndLogout') : t('logout')}
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
}

export default DropdownNav
