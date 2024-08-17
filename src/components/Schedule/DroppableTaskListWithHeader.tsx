// @ts-nocheck
import { Droppable } from '@hello-pangea/dnd'
import React from 'react'
import { ITask, TASK_LIST, UpdateTaskRequest } from '../../models/appModel'
import ScheduleHeader from '../common/ScheduleHeader'
import Task from '.././Inbox/Task'

interface SectionedDroppableTaskListProps {
    droppableId: string
    header?: string
    isDraggable?: boolean
    tasks: ITask[]
    onSaveTask: (id: number, request: UpdateTaskRequest) => void
    onTaskClose: (id: number) => void
}

const DroppableTaskListWithHeader: React.FC<SectionedDroppableTaskListProps> = ({ droppableId, header, isDraggable, tasks, onTaskClose, onSaveTask }) => {
    if (tasks.length === 0) return null

    const fakeChildrenBecauseTypesAreWrongInDragAndDropLibrary = null

    return <>
        {header && <ScheduleHeader>{header}</ScheduleHeader>}
        <Droppable droppableId={droppableId}>
            {provided => <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) =>
                    <Task
                        draggableId={task.id}
                        isDraggable={isDraggable || false}
                        key={task.id}
                        index={index}
                        id={task.id!}
                        name={task.name!}
                        description={task.description}
                        dueDate={task.dueDate}
                        closed={droppableId === TASK_LIST.CLOSED}
                        onTaskClose={onTaskClose}
                        saveTask={onSaveTask}
                    >
                        {fakeChildrenBecauseTypesAreWrongInDragAndDropLibrary}
                    </Task>
                )}
                {provided.placeholder}
            </div>}
        </Droppable>
    </>
}

export default DroppableTaskListWithHeader