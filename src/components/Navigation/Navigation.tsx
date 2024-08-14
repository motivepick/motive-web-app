import React from 'react'
import DropdownNav from './DropdownNav'
import ExpandedNav from './ExpandedNav'

interface NavigationProps {
    isTemporaryUserLoggedIn?: boolean
    onAllTasksClick?: () => void
}

const Navigation: React.FC<NavigationProps> = ({ isTemporaryUserLoggedIn, onAllTasksClick }) =>
    <nav className="navbar navbar-expand navbar-light bg-light" style={{ borderRadius: '.25rem' }}>
        <div className="container-fluid">
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto" style={{ textTransform: 'uppercase', fontSize: '80%' }}>
                    <ExpandedNav onAllTasksClick={onAllTasksClick}/>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <DropdownNav isTemporaryUserLoggedIn={isTemporaryUserLoggedIn}/>
                </ul>
            </div>
        </div>
    </nav>

export default Navigation
