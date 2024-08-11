// @ts-ignore
import React, { Fragment, PureComponent } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { API_URL, FACEBOOK_AUTH_URL, VK_AUTH_URL } from '../../config'

interface DropdownNavProps extends WithTranslation {
    isTemporaryUserLoggedIn: boolean;
}

class DropdownNav extends PureComponent<DropdownNavProps> {
    render() {
        const { isTemporaryUserLoggedIn, t } = this.props
        return (
            <UncontrolledDropdown>
                <DropdownToggle nav>
                    <i className="fa fa-bars"/>
                </DropdownToggle>
                <DropdownMenu right>
                    {isTemporaryUserLoggedIn &&
                        <Fragment>
                            <DropdownItem onClick={this.handleVkLogin}>
                                <i className="fa fa-vk" style={{ marginRight: '0.1em' }}/> {t('login.vk')}
                            </DropdownItem>
                            <DropdownItem onClick={this.handleFacebookLogin}>
                                <i className="fa fa-facebook-square" style={{ marginRight: '0.1em' }}/> {t('login.facebook')}
                            </DropdownItem>
                        </Fragment>}
                    <DropdownItem className={isTemporaryUserLoggedIn ? 'text-danger' : ''} onClick={this.handleLogout}>
                        <i className="fa fa-sign-out" style={{ marginRight: '0.3em' }}/>
                        {isTemporaryUserLoggedIn ? t('deleteTasksAndLogout') : t('logout')}
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        )
    }

    handleVkLogin = () => {
        window.location.href = VK_AUTH_URL
    }

    handleFacebookLogin = () => {
        window.location.href = FACEBOOK_AUTH_URL
    }

    handleLogout = async () => {
        window.location.href = `${API_URL}/logout`
    }
}

export default withTranslation()(DropdownNav)
