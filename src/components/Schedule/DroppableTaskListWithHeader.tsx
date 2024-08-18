import { DraggableChildrenFn, Droppable } from '@hello-pangea/dnd'
import React, { FC } from 'react'
import { ITask, TASK_LIST_ID, UpdateTaskRequest } from '../../models/appModel'
import ScheduleHeader from '../common/ScheduleHeader'
import Task from '.././Inbox/Task'

interface SectionedDroppableTaskListProps {
    droppableId: string
    header?: string
    isDraggable?: boolean
    isDropDisabled?: boolean
    showEmptyList?: boolean
    tasks: ITask[]
    onSaveTask: (id: number, request: UpdateTaskRequest) => void
    onTaskClose: (id: number) => void
}

const noop: DraggableChildrenFn = () => null

const DroppableTaskListWithHeader: FC<SectionedDroppableTaskListProps> = ({
        droppableId,
        header,
        isDraggable,
        isDropDisabled,
        showEmptyList,
        tasks,
        onTaskClose,
        onSaveTask
    }) => {
    if (!showEmptyList && tasks.length === 0) return null
    return (
        <>
            {header && <ScheduleHeader>{header}</ScheduleHeader>}
            <Droppable droppableId={droppableId} isDropDisabled={isDropDisabled || false}>
                {provided => <div {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks.map((task, index) =>
                        <Task
                            draggableId={task.id.toString()}
                            isDraggable={isDraggable || false}
                            key={task.id}
                            index={index}
                            id={task.id!}
                            name={task.name!}
                            description={task.description}
                            dueDate={task.dueDate}
                            closed={droppableId === TASK_LIST_ID.CLOSED}
                            onTaskClose={onTaskClose}
                            saveTask={onSaveTask}
                        >
                            {noop}
                        </Task>
                    )}
                    {provided.placeholder}
                </div>}
            </Droppable>
        </>
    )
}

export default DroppableTaskListWithHeader
