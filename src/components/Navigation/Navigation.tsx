// @ts-ignore
import { History } from 'history'
import React, { PureComponent } from 'react'
import { history } from '../../index'
import DropdownNav from './DropdownNav'
import ExpandedNav from './ExpandedNav'

interface NavigationProps {
    history: History;
    isTemporaryUserLoggedIn: boolean;
    onAllTasksClick?: () => void
}

class Navigation extends PureComponent<NavigationProps> {

    render() {
        const { isTemporaryUserLoggedIn, onAllTasksClick } = this.props
        return (
            <nav className="navbar navbar-expand navbar-light bg-light" style={{ borderRadius: '.25rem' }}>
                <div className="container-fluid">
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto" style={{ textTransform: 'uppercase', fontSize: '80%' }}>
                            <ExpandedNav onAllTasksClick={onAllTasksClick} history={history} />
                        </ul>
                        <ul className="navbar-nav ml-auto">
                            <DropdownNav isTemporaryUserLoggedIn={isTemporaryUserLoggedIn} />
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }

    handleAllTasksClick = () => {
        history.push('/')
    }
}

export default Navigation
