import { DragDropContext } from 'react-beautiful-dnd'
import Navigation from '../Navigation/Navigation'
import React from 'react'
import { IUser } from '../../models/appModel'
import Footer from '../common/Footer'

type TDraggableLayout = {
    user: IUser;
    onAllTasksClick?: () => void
    onDragEnd: () => void;
}

const DraggableLayout: React.FC<TDraggableLayout> = (props) => {
    const { children, user, onAllTasksClick, onDragEnd } = props
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Navigation user={user} onAllTasksClick={onAllTasksClick}/>
            { children }
            <Footer/>
        </DragDropContext>
    )
}

export default DraggableLayout
