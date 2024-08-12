// @ts-nocheck
import { Droppable } from '@hello-pangea/dnd'
import React from 'react'
import { ITask, ITaskNullable, TASK_LIST } from '../../models/appModel'
import ScheduleHeader from '../common/ScheduleHeader'
import Task from '../Tasks/Task'

interface SectionedDroppableTaskListProps {
    droppableId: string
    header?: string
    isDraggable?: boolean
    tasks: ITaskNullable[]
    onSaveTask: (id: number, task: ITask) => void
    onTaskClose: (id: number) => void
}

const DroppableTaskListWithHeader: React.FC<SectionedDroppableTaskListProps> = ({ droppableId, header, isDraggable, tasks, onTaskClose, onSaveTask }) => {
    if (tasks.length === 0) return null

    return <>
        {header && <ScheduleHeader>{header}</ScheduleHeader>}
        <Droppable droppableId={droppableId}>
            {provided => <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) =>
                    <Task isDraggable={isDraggable || false} key={task.id} index={index} id={task.id!} name={task.name!}
                          description={task.description}
                          dueDate={task.dueDate}
                          closed={droppableId === TASK_LIST.CLOSED}
                          onTaskClose={onTaskClose}
                          saveTask={onSaveTask}/>
                )}
                {provided.placeholder}
            </div>}
        </Droppable>
    </>
}

export default DroppableTaskListWithHeader