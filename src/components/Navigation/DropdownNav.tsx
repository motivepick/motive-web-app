import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { API_URL, GITHUB_AUTH_URL, VK_AUTH_URL } from '../../config'
import Icon from '../Icon'

interface Props {
    onSynchronize: () => void
    isTemporaryUserLoggedIn?: boolean
}

const DropdownNav: FC<Props> = ({ onSynchronize, isTemporaryUserLoggedIn }) => {
    const { t } = useTranslation()

    const handleVkLogin = useCallback(() => window.location.href = VK_AUTH_URL, [])
    const handleGitHubLogin = useCallback(() => window.location.href = GITHUB_AUTH_URL, [])
    const handleLogout = useCallback(() => window.location.href = `${API_URL}/logout`, [])

    return (
        <li className="nav-item dropdown">
            <a href="#" className="nav-link" aria-expanded="false" data-bs-toggle="dropdown">
                <Icon icon="fa-solid fa-bars"/>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
                <li>
                    <button type="button" className="dropdown-item" role="menuitem" onClick={onSynchronize}>
                        <Icon icon="fa-solid fa-rotate"/> {t('synchronize')}
                    </button>
                </li>
                {isTemporaryUserLoggedIn && <>
                    <li>
                        <button type="button" className="dropdown-item" role="menuitem" onClick={handleGitHubLogin}>
                            <Icon icon="fa-brands fa-github" style={{ marginRight: '0.1em' }}/> {t('login.github')}
                        </button>
                    </li>
                    <li>
                        <button type="button" className="dropdown-item" role="menuitem" onClick={handleVkLogin}>
                            <Icon icon="fa-brands fa-vk" style={{ marginRight: '0.1em' }}/> {t('login.vk')}
                        </button>
                    </li>
                </>}
                <li>
                    <button type="button" className="text-danger dropdown-item" role="menuitem" onClick={handleLogout}>
                        <Icon icon="fa-solid fa-right-from-bracket" style={{ marginRight: '0.2em' }}/>
                        {isTemporaryUserLoggedIn ? t('deleteTasksAndLogout') : t('logout')}
                    </button>
                </li>
            </ul>
        </li>
    )
}

export default DropdownNav
