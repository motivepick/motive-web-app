import { DraggableChildrenFn, Droppable, DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd'
import React, { FC } from 'react'
import { ITask, TASK_LIST_ID, UpdateTaskRequest } from '../../models/appModel'
import ScheduleHeader from '../common/ScheduleHeader'
import Task from '.././Inbox/Task'

import './DroppableTaskListWithHeader.css'

interface SectionedDroppableTaskListProps {
    droppableId: string
    header?: string
    isDraggable?: boolean
    isDropDisabled?: boolean
    tasks: ITask[]
    onSaveTask: (id: number, request: UpdateTaskRequest) => void
    onTaskClose: (id: number) => void
}

const noop: DraggableChildrenFn = () => null

const getBackgroundColorClassName = (dropSnapshot: DroppableStateSnapshot): string => {
    if (dropSnapshot.isDraggingOver) return 'dragging-over'
    if (dropSnapshot.draggingFromThisWith) return 'dragging-from'
    return ''
}

const TaskList = ({
                      droppableId,
                      innerRef,
                      droppableProps,
                      placeholder,
                      isDraggable,
                      tasks,
                      onTaskClose,
                      onSaveTask
}: SectionedDroppableTaskListProps & DroppableProvided) =>
    <div {...droppableProps} ref={innerRef}>
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
        {placeholder}
    </div>

const DroppableTaskListWithHeader: FC<SectionedDroppableTaskListProps> = (props) => {
    const { droppableId, header, isDropDisabled } = props
    return (
        <>
            {header && <ScheduleHeader>{header}</ScheduleHeader>}
            <Droppable droppableId={droppableId} isDropDisabled={isDropDisabled || false}>
                {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) =>
                    header
                        ? <div className={`task-list-container ${getBackgroundColorClassName(dropSnapshot)}`}>
                            <TaskList {...dropProvided} {...props} />
                        </div>
                        : <TaskList {...dropProvided} {...props} />}
            </Droppable>
        </>
    )
}

export default DroppableTaskListWithHeader